# Relationship Modeling: When Verbs Become Nouns

## The Problem

A common architectural issue occurs when modeling relationships with metadata in relational databases and object-oriented systems. What should conceptually be a relationship (verb) gets forced into becoming an entity (noun), leading to awkward domain models.

## Example: Character Kills Character

### Conceptual Model (Graph-Like)
```
Character --[kills with method, location, time]--> Character
```

### What We're Forced to Create (Relational)
```sql
CREATE TABLE character_kills (
    id SERIAL PRIMARY KEY,
    killer_id INTEGER REFERENCES characters(id),
    victim_id INTEGER REFERENCES characters(id),
    method VARCHAR(255),
    location VARCHAR(255),
    description TEXT,
    occurred_at TIMESTAMP
);
```

### GraphQL Representation
```graphql
type Kill {
  id: ID!
  killer: Character!
  victim: Character!
  method: String
  location: String
  description: String
  occurredAt: String
}
```

## Why This Feels Wrong

1. **"Kill" is an action, not a thing** - We've reified a verb into a noun
2. **Artificial entity creation** - The relationship gets an ID and becomes queryable as if it were a domain entity
3. **Domain confusion** - Team members start treating these as real business objects
4. **Behavior creep** - Once it's a class, people add methods, validation, state machines

## Root Causes

### 1. Relational Database Limitations
- RDBs cannot store properties directly on relationships
- Many-to-many with metadata requires a junction table
- Junction tables need primary keys, making them feel like entities

### 2. Object-Oriented Programming Influence
- OOP encourages making everything an object
- Leads to classes like `Kill`, `Marriage`, `Transaction` with methods
- Encapsulation pushes behavior into these relationship objects

### 3. Framework Conventions
- ORMs treat every table as an entity
- GraphQL makes everything a queryable type
- API design patterns expect resources with IDs

## Alternative Approaches

### 1. Event Sourcing Pattern
Treat relationships as immutable events rather than entities:

```graphql
type CharacterKilledEvent {
  occurredAt: DateTime!
  killerId: ID!
  victimId: ID!
  metadata: KillMetadata!
}

# Access pattern
type Character {
  killedEvents: [CharacterKilledEvent!]!
  deathEvent: CharacterKilledEvent
}
```

### 2. Keep It Thin (Data-Only Entities)
If you must create an entity, resist adding behavior:

```graphql
# Pure data holder - no computed fields, no nested logic
type KillRecord {
  killer: Character!
  victim: Character!
  method: String
  location: String
  occurredAt: DateTime!
}
```

### 3. Graph Database Approach
Use databases that natively support relationship properties:

```cypher
// Neo4j example
(vader:Character)-[:KILLED {
  method: "lightsaber",
  location: "Death Star",
  occurred_at: "1977-05-25"
}]->(obiwan:Character)
```

### 4. CQRS Separation
Separate write and read models:

```typescript
// Write model - commands/events
interface CharacterKilledCommand {
  killerId: string;
  victimId: string;
  method: string;
  location: string;
}

// Read model - projections
interface KillStatistics {
  totalKills: number;
  methodBreakdown: Record<string, number>;
  timeline: KillEvent[];
}
```

### 5. Embedded Metadata Pattern
Store relationship data as properties on one side:

```sql
-- Instead of junction table
ALTER TABLE characters ADD COLUMN kills JSONB;

-- Store as array of kill records
UPDATE characters SET kills = '[
  {"victim_id": 123, "method": "lightsaber", "location": "Death Star"}
]' WHERE id = 456;
```

## Best Practices

### Naming Conventions
Use suffixes that indicate the true nature:
- `KillEvent` instead of `Kill`
- `MarriageRecord` instead of `Marriage`
- `TransactionLog` instead of `Transaction`
- `character_kill_events` instead of `character_kills`

### Design Principles
1. **Immutable by default** - Once created, never updated
2. **No business logic** - Pure data structures only
3. **Clear documentation** - Explicitly state these represent relationships
4. **Resist feature creep** - Don't add computed properties or methods

### Access Patterns
Focus on relationship-centric queries rather than entity-centric:

```graphql
# Good - relationship-focused
type Character {
  kills: [KillEvent!]!
  killedBy: KillEvent
  killCount: Int!
}

# Avoid - treating relationship as primary entity
type Query {
  kill(id: ID!): Kill  # This makes kills feel like entities
}
```

## Language-Specific Considerations

### Java/C# (Strongly Typed OOP)
```java
// Avoid this
public class Kill {
    public void validate() { ... }
    public void notify() { ... }
    public KillResult execute() { ... }
}

// Prefer this
public record KillEvent(
    CharacterId killer,
    CharacterId victim,
    String method,
    LocalDateTime occurredAt
) {
    // Data only, no behavior
}
```

### JavaScript/TypeScript
```typescript
// Avoid classes for relationship data
class Kill {
  constructor(killer, victim, method) { ... }
  validate() { ... }
}

// Prefer plain objects or minimal interfaces
interface KillEvent {
  readonly killer: Character;
  readonly victim: Character;
  readonly method: string;
  readonly occurredAt: Date;
}
```

### GraphQL Schema Design
```graphql
# Make the relationship nature explicit
type Kill {
  """
  Note: This represents a relationship between characters,
  not a domain entity. Treat as immutable event data.
  """
  killer: Character!
  victim: Character!
  # ... other fields
}
```

## When Reification Is Acceptable

Sometimes turning relationships into entities is the right choice:

1. **Complex business rules** - When the relationship itself has important business logic
2. **Lifecycle management** - When relationships have states (pending, approved, expired)
3. **Audit requirements** - When you need to track changes to relationship metadata
4. **Performance optimization** - When query patterns favor entity-based access

## Conclusion

The verb-to-noun transformation is often inevitable in relational systems, but we can minimize its negative impact by:

1. **Acknowledging what's happening** - Recognize these as reified relationships
2. **Naming thoughtfully** - Use terminology that reflects their true nature
3. **Limiting scope** - Keep them as data holders, not behavior containers
4. **Documenting intent** - Make the relationship nature explicit
5. **Choosing appropriate tools** - Consider graph databases for relationship-heavy domains

The goal isn't to eliminate this pattern entirely, but to be conscious of it and prevent relationship data from evolving into complex domain entities that don't truly belong in your business model.

## Examples in the Wild

### Good Examples
- `Event` in event sourcing systems
- `LogEntry` in audit systems  
- `TransactionRecord` in financial systems

### Problematic Examples
- `Friendship` with methods like `strengthen()` and `weaken()`
- `Membership` with complex state machines
- `Relationship` with business logic for relationship types

Remember: If you find yourself adding significant behavior to these entities, step back and consider whether you're modeling the domain correctly.