// REAL WORLD EXAMPLE: Messy Database with Unclear Relationships

// Imagine you inherited this database:
/*
Tables:
- tbl_usr (users)
- tbl_prd (products) 
- usr_prd_rel (user-product relationship - but what kind?)
- usr_usr_link (user to user connection - but what type?)
- doc_ref (document references - related to what?)
*/

// BAD: Direct database exposure in GraphQL
const badSchema = `
  type TblUsr {
    id: Int!
    usr_nm: String
    usr_prd_rel: [UsrPrdRel]
    usr_usr_link: [UsrUsrLink]
  }
`;

// GOOD: GraphQL as semantic layer
const goodSchema = `
  type User {
    id: ID!
    name: String!
    email: String!
    
    # Clarify what usr_prd_rel actually means:
    purchasedProducts: [Product!]!
    favoriteProducts: [Product!]!
    reviewedProducts: [ProductReview!]!
    
    # Clarify what usr_usr_link means:
    following: [User!]!
    followers: [User!]!
    friends: [User!]!  # bidirectional relationships
    blockedUsers: [User!]!
    
    # Clarify document relationships:
    uploadedDocuments: [Document!]!
    sharedDocuments: [Document!]!
  }
  
  type ProductReview {
    product: Product!
    rating: Int!
    comment: String
    createdAt: DateTime!
  }
`;

// The resolvers figure out the relationship type:
const resolvers = {
  User: {
    purchasedProducts: async (user, _, { db }) => {
      // Check the relationship type in the junction table
      const products = await db.query(`
        SELECT p.* FROM tbl_prd p
        JOIN usr_prd_rel upr ON p.id = upr.prd_id
        WHERE upr.usr_id = $1 AND upr.rel_type = 'purchase'
      `, [user.id]);
      return products;
    },
    
    favoriteProducts: async (user, _, { db }) => {
      const products = await db.query(`
        SELECT p.* FROM tbl_prd p
        JOIN usr_prd_rel upr ON p.id = upr.prd_id
        WHERE upr.usr_id = $1 AND upr.rel_type = 'favorite'
      `, [user.id]);
      return products;
    },
    
    following: async (user, _, { db }) => {
      // Directional relationship
      const users = await db.query(`
        SELECT u.* FROM tbl_usr u
        JOIN usr_usr_link uul ON u.id = uul.target_usr_id
        WHERE uul.source_usr_id = $1 AND uul.link_type = 'follow'
      `, [user.id]);
      return users;
    },
    
    friends: async (user, _, { db }) => {
      // Bidirectional relationship - need to check both directions
      const users = await db.query(`
        SELECT DISTINCT u.* FROM tbl_usr u
        JOIN usr_usr_link uul1 ON u.id = uul1.target_usr_id
        JOIN usr_usr_link uul2 ON u.id = uul2.source_usr_id
        WHERE uul1.source_usr_id = $1 
          AND uul2.target_usr_id = $1
          AND uul1.link_type = 'friend'
          AND uul2.link_type = 'friend'
      `, [user.id]);
      return users;
    }
  }
};