// COMMON PATTERNS FOR TRANSLATING DATABASES TO GRAPHQL

// 1. PATTERN: Junction Table with Metadata
// Database: order_items (order_id, product_id, quantity, price_at_purchase)
const orderSchema = `
  type Order {
    id: ID!
    # Don't expose junction table directly
    # items: [OrderItem]  ❌
    
    # Instead, make it meaningful:
    items: [OrderLineItem!]! ✅
  }
  
  type OrderLineItem {
    product: Product!
    quantity: Int!
    priceAtPurchase: Float!
    subtotal: Float! # Calculated field
  }
`;

// 2. PATTERN: Polymorphic Relationships
// Database: notifications (id, user_id, entity_type, entity_id)
const notificationSchema = `
  type Notification {
    id: ID!
    user: User!
    
    # Instead of entity_type/entity_id:
    regarding: NotificationSubject!
  }
  
  # Union type for polymorphic relationship
  union NotificationSubject = Order | Product | User | Comment
`;

// 3. PATTERN: Status/Type Codes
// Database: users (id, name, status_code, account_type)
const userSchema = `
  # Convert cryptic codes to enums:
  enum UserStatus {
    ACTIVE      # status_code: 1
    SUSPENDED   # status_code: 2
    DELETED     # status_code: 3
  }
  
  enum AccountType {
    FREE        # account_type: 'f'
    PREMIUM     # account_type: 'p'
    ENTERPRISE  # account_type: 'e'
  }
  
  type User {
    id: ID!
    name: String!
    status: UserStatus!
    accountType: AccountType!
  }
`;

// 4. PATTERN: Computed/Virtual Fields
// Add fields that don't exist in database but make sense in API
const enhancedSchema = `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    
    # Computed fields:
    fullName: String! # firstName + lastName
    initials: String! # First letter of each name
    
    # Aggregated data:
    totalPurchases: Float!
    accountAge: Int! # Days since created
    isPremium: Boolean! # Derived from accountType
  }
`;

// 5. PATTERN: Hiding Implementation Details
class UserResolver {
  // Database might have: usr_fname, usr_lname, usr_mid_init
  // But GraphQL presents clean interface:
  
  fullName(user) {
    const middle = user.usr_mid_init ? ` ${user.usr_mid_init}.` : '';
    return `${user.usr_fname}${middle} ${user.usr_lname}`;
  }
  
  // Database might track login attempts in separate table
  // But GraphQL makes it simple:
  async lastLogin(user, _, { db }) {
    const result = await db.query(
      'SELECT MAX(timestamp) as last FROM login_attempts WHERE user_id = $1 AND success = true',
      [user.id]
    );
    return result.rows[0].last;
  }
  
  // Complex permission system simplified:
  async permissions(user, _, { db }) {
    // Might involve 5 tables: users, roles, user_roles, permissions, role_permissions
    // But user just sees: user.permissions
    const perms = await db.query(`
      SELECT DISTINCT p.name, p.resource, p.action
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = $1
    `, [user.id]);
    
    return perms.rows.map(p => ({
      name: p.name,
      resource: p.resource,
      action: p.action,
      // Add helpful computed field:
      displayName: `${p.action} ${p.resource}` // "Edit Posts"
    }));
  }
}

// 6. PATTERN: DataLoader for N+1 Query Prevention
const DataLoader = require('dataloader');

const createLoaders = (db) => ({
  // Batch load users by ID
  userLoader: new DataLoader(async (userIds) => {
    const users = await db.query(
      'SELECT * FROM users WHERE id = ANY($1)',
      [userIds]
    );
    // DataLoader expects results in same order as input
    return userIds.map(id => users.find(u => u.id === id));
  }),
  
  // Batch load user->products relationships
  userProductsLoader: new DataLoader(async (userIds) => {
    const products = await db.query(`
      SELECT up.user_id, p.*
      FROM usr_prd_rel up
      JOIN products p ON up.product_id = p.id
      WHERE up.user_id = ANY($1)
    `, [userIds]);
    
    // Group by user_id
    return userIds.map(userId => 
      products.filter(p => p.user_id === userId)
    );
  })
});