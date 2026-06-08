# Day 02 - Relational Databases, Transactions and ACID Properties

## Introduction

Every software system revolves around data.

Whether it is:

* User Accounts
* Orders
* Payments
* Products
* Inventory
* Banking Transactions
* Social Media Posts

the most valuable asset of a system is its data.

A system can tolerate temporary downtime.

A system can recover from server failures.

A system can recover from network issues.

But if the data becomes incorrect, corrupted, or lost, recovering becomes extremely difficult.

For this reason, databases are designed to provide strong guarantees around:

* Data Consistency
* Data Integrity
* Data Durability
* Reliability
* Correctness

Relational Databases were specifically designed to solve these problems.

Understanding these guarantees is fundamental to High-Level System Design.

---

# What is a Relational Database?

A Relational Database stores data in the form of tables.

Example:

## Users Table

| id | name  | email                                     |
| -- | ----- | ----------------------------------------- |
| 1  | Nitin | [nitin@gmail.com](mailto:nitin@gmail.com) |
| 2  | Rahul | [rahul@gmail.com](mailto:rahul@gmail.com) |

---

## Orders Table

| id | user_id | amount |
| -- | ------- | ------ |
| 1  | 1       | 500    |
| 2  | 2       | 1000   |

---

The relationship between tables is established using keys.

```text
Users
│
│ id
▼

Orders
│
│ user_id
▼
```

This allows relational databases to maintain structured and connected data.

Popular Relational Databases:

* PostgreSQL
* MySQL
* Oracle
* SQL Server
* MariaDB

---

# Why Relational Databases Exist

Relational databases were built to guarantee:

```text
Correct Data

Consistent Data

Reliable Data

Durable Data
```

These guarantees become critical in systems such as:

* Banking
* E-Commerce
* Healthcare
* Finance
* Payment Systems

---

# Key Properties of Relational Databases

Relational databases focus heavily on:

1. Data Consistency
2. Data Integrity
3. Data Durability
4. Constraints
5. Transactions

These properties work together to ensure correctness.

---

# Data Consistency

Consistency means:

> The database should always remain in a valid state.

No matter what operation occurs.

---

## Example

Suppose a bank account should never have a negative balance.

```text
Account Balance = ₹5000
```

Someone attempts:

```text
Withdraw ₹10000
```

Result:

```text
Balance = -₹5000
```

This violates business rules.

A consistent database prevents such invalid states.

---

Consistency ensures:

```text
Valid State
      ↓
Operation
      ↓
Valid State
```

The database should never transition into an invalid state.

---

# Data Integrity

Integrity means:

> Data stored in the database must remain accurate and trustworthy.

---

## Example

Orders Table

```text
order_id = 1
user_id = 100
```

But User 100 does not exist.

Now the order references invalid data.

This is an integrity violation.

---

Integrity ensures:

```text
Orders
    │
    │
    ▼
Existing User
```

and prevents:

```text
Orders
    │
    ▼
Non-existent User
```

---

# Data Durability

Durability means:

> Once data is committed, it should never be lost.

Even if:

* Server crashes
* Application crashes
* Power failure occurs
* Network failures occur

---

## Example

A user successfully transfers money.

```text
Transfer Successful
```

Immediately after:

```text
Database Server Crashes
```

After restart:

```text
Transfer Must Still Exist
```

Otherwise users would lose trust in the system.

Durability guarantees permanent storage.

---

# Database Constraints

Constraints are rules enforced by the database.

They prevent invalid data from entering the system.

---

# Primary Key Constraint

A Primary Key uniquely identifies a record.

Example:

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);
```

Valid:

```text
1
2
3
```

Invalid:

```text
1
1
```

Duplicate IDs are not allowed.

---

# Unique Constraint

Prevents duplicate values.

Example:

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE
);
```

Now:

```text
nitin@gmail.com
nitin@gmail.com
```

is not allowed.

---

# Not Null Constraint

Prevents missing values.

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
```

Invalid:

```text
name = NULL
```

---

# Check Constraint

Defines custom rules.

Example:

```sql
CREATE TABLE accounts (
    balance DECIMAL CHECK(balance >= 0)
);
```

Now:

```text
balance = -500
```

is rejected.

---

# Foreign Key Constraint

Maintains referential integrity.

Example:

```sql
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY(user_id)
    REFERENCES users(id)
);
```

Now:

```text
user_id = 100
```

cannot exist unless User 100 exists.

---

# Cascading Operations

Sometimes parent-child relationships exist.

Example:

```text
User
  │
  ▼
Orders
```

What happens if a user is deleted?

---

## ON DELETE CASCADE

```sql
FOREIGN KEY(user_id)
REFERENCES users(id)
ON DELETE CASCADE
```

Now:

```text
Delete User
```

Automatically:

```text
Delete Orders
```

---

Without cascade:

```text
User Deleted

Orders Still Exist
```

creating orphan records.

---

# Triggers

Triggers automatically execute logic when events occur.

Example:

Whenever salary changes:

```sql
CREATE TRIGGER log_salary_change
AFTER UPDATE ON employees
FOR EACH ROW
```

The database automatically records changes.

Triggers help enforce consistency and business rules.

---

# Why Transactions Are Needed

Consider a banking transfer.

User A:

```text
₹10,000
```

User B:

```text
₹5,000
```

Transfer:

```text
₹1000
```

Expected:

```text
A = ₹9000

B = ₹6000
```

---

Database operations:

```sql
UPDATE accounts
SET balance = balance - 1000
WHERE id = 1;

UPDATE accounts
SET balance = balance + 1000
WHERE id = 2;
```

---

What if:

```text
First Query Succeeds

Server Crashes

Second Query Never Executes
```

Result:

```text
A = ₹9000

B = ₹5000
```

₹1000 disappeared.

This is unacceptable.

---

# Transactions

A Transaction is a group of operations treated as a single unit.

Either:

```text
Everything Succeeds
```

or

```text
Everything Fails
```

---

## Transaction Example

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 1000
WHERE id = 1;

UPDATE accounts
SET balance = balance + 1000
WHERE id = 2;

COMMIT;
```

---

If any operation fails:

```sql
ROLLBACK;
```

Database returns to previous state.

---

# ACID Properties

Transactions are governed by ACID.

```text
A → Atomicity

C → Consistency

I → Isolation

D → Durability
```

---

# Atomicity

Atomicity means:

> Either everything happens or nothing happens.

---

## Bank Transfer Example

```text
Withdraw ₹1000
Deposit ₹1000
```

Valid:

```text
Both Complete
```

Invalid:

```text
Only Withdraw Happens
```

Atomicity prevents partial execution.

---

# Consistency

Consistency means:

> Every transaction moves the database from one valid state to another valid state.

---

Example:

```text
Balance >= 0
```

must always remain true.

Transactions cannot violate business rules.

---

# Isolation

Isolation means:

> Concurrent transactions should not interfere with each other.

Users should not see incomplete changes.

---

Example:

Transaction A:

```text
Updating Balance
```

Transaction B:

```text
Reading Balance
```

B should not observe half-completed updates.

---

# Durability

Durability means:

> Once COMMIT succeeds, data is permanent.

Even if:

```text
Server Crash

Power Failure

Application Restart
```

Data remains preserved.

---

# Isolation Levels

Different systems require different tradeoffs.

Relational databases provide multiple isolation levels.

---

# Read Uncommitted

Lowest isolation level.

Transactions can read uncommitted changes.

---

Example:

Transaction A:

```text
Balance = 5000
```

Updates:

```text
Balance = 10000
```

but has NOT committed.

Transaction B reads:

```text
10000
```

If A rolls back:

```text
Balance = 5000
```

B saw invalid data.

This is called:

> Dirty Read

---

# Read Committed

Only committed data can be read.

Dirty Reads are prevented.

---

Example:

Transaction A:

```text
Updates Balance
```

Not committed.

Transaction B:

```text
Cannot See Update
```

Only committed values are visible.

---

# Repeatable Read

Ensures repeated reads return the same value.

---

Example

Transaction A:

```sql
SELECT balance
FROM accounts
WHERE id = 1;
```

Returns:

```text
5000
```

---

Transaction B:

```sql
UPDATE accounts
SET balance = 10000;
```

Commits.

---

Transaction A reads again.

Still sees:

```text
5000
```

throughout its transaction.

---

# Serializable

Highest isolation level.

Transactions behave as if executed one by one.

---

Instead of:

```text
T1 + T2 simultaneously
```

database behaves like:

```text
T1
then
T2

or

T2
then
T1
```

---

Provides maximum correctness.

But also:

```text
Highest Locking

Lowest Concurrency

Lowest Performance
```

---

# Isolation Level Comparison

| Isolation Level  | Dirty Reads | Non-Repeatable Reads | Phantom Reads |
| ---------------- | ----------- | -------------------- | ------------- |
| Read Uncommitted | Possible    | Possible             | Possible      |
| Read Committed   | Prevented   | Possible             | Possible      |
| Repeatable Read  | Prevented   | Prevented            | Possible      |
| Serializable     | Prevented   | Prevented            | Prevented     |

---

# Key Takeaways

1. Relational databases prioritize correctness and consistency.

2. Constraints prevent invalid data from entering the system.

3. Foreign keys maintain referential integrity.

4. Cascades help manage parent-child relationships.

5. Transactions ensure multiple operations behave as a single unit.

6. ACID properties guarantee reliability.

7. Atomicity prevents partial execution.

8. Consistency ensures valid states.

9. Isolation protects concurrent transactions.

10. Durability guarantees permanent storage after commit.

11. Isolation levels trade correctness for performance and concurrency.

12. Understanding transactions and ACID is essential before learning replication, sharding, distributed databases, and modern system design.
