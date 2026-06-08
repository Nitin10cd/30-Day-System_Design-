# Day 02 - Database Partitioning and Sharding

## Table of Contents

1. Introduction
2. The Scaling Problem
3. Vertical Scaling vs Horizontal Scaling
4. What is Database Partitioning?
5. Why Partition Data?
6. Types of Partitioning
   - Horizontal Partitioning
   - Vertical Partitioning
7. Advantages and Disadvantages of Partitioning
8. What is Sharding?
9. Why Sharding?
10. Shard Key
11. Types of Sharding
    - Range Based Sharding
    - Hash Based Sharding
    - Directory Based Sharding
    - Geo Based Sharding
12. Shard Rebalancing
13. Hotspot Problem
14. Cross Shard Queries
15. Partitioning vs Sharding
16. When Not To Use Sharding
17. Real World Examples
18. Summary

---

# Introduction

Every application starts small.

Initially:

```text
Users        : 100
Orders       : 1,000
Messages     : 10,000
Storage      : 50 MB
```

A single database server can easily handle the workload.

As the application grows:

```text
Users        : 10 Million
Orders       : 500 Million
Messages     : Billions
Storage      : 50+ TB
```

The database becomes the bottleneck.

Common symptoms:

- Slow Queries
- High CPU Usage
- Memory Pressure
- Disk Bottlenecks
- Long Response Times
- Reduced Availability

At this point simply writing better SQL is not enough.

The database itself must scale.

This introduces two important concepts:

```text
Partitioning
Sharding
```

These are among the most important techniques used in large-scale distributed systems.

---

# The Scaling Problem

Consider a single database server.

```text
                Users

                  │
                  ▼

       +--------------------+
       |     Database       |
       +--------------------+

           CPU 95%
           RAM 90%
           Disk 85%
```

As traffic grows:

```text
More Reads

More Writes

More Storage

More Connections
```

Eventually the server reaches its limits.

A single machine cannot scale forever.

---

# Vertical Scaling vs Horizontal Scaling

Before discussing partitioning and sharding, we need to understand two approaches to scaling.

---

## Vertical Scaling

Increase resources of the existing machine.

```text
8 GB RAM
     │
     ▼
64 GB RAM
```

```text
4 CPU Cores
      │
      ▼
32 CPU Cores
```

Architecture:

```text
       +----------------+
       | Bigger Server  |
       +----------------+
```

### Advantages

- Simple
- No application changes
- Easy to implement

### Disadvantages

- Expensive
- Hardware limits exist
- Single point of failure

---

## Horizontal Scaling

Instead of making one machine bigger, add more machines.

```text
Database 1

Database 2

Database 3

Database 4
```

Architecture:

```text
         +-----------+
         | Router    |
         +-----------+
          /   |   \
         /    |    \
        ▼     ▼     ▼

     DB1    DB2    DB3
```

This approach forms the foundation of distributed systems.

---

# What is Database Partitioning?

Partitioning means:

> Splitting a large database table into smaller logical pieces.

These smaller pieces are called partitions.

Important:

All partitions may still live inside the same database server.

Partitioning primarily improves:

- Manageability
- Query Performance
- Maintenance

---

# Why Partition Data?

Suppose we have:

```text
Users Table

100 Million Rows
```

Without partitioning:

```text
+--------------------------------+
|           USERS               |
|       100 Million Rows        |
+--------------------------------+
```

Every query scans a massive dataset.

This becomes expensive.

Instead:

```text
+------------------+
| Users Part 1     |
+------------------+

+------------------+
| Users Part 2     |
+------------------+

+------------------+
| Users Part 3     |
+------------------+
```

Now operations become more efficient.

---

# Types of Partitioning

Partitioning is generally divided into two categories.

```text
Partitioning
│
├── Horizontal Partitioning
│
└── Vertical Partitioning
```

---

# Horizontal Partitioning

Horizontal Partitioning divides rows.

Every partition contains the same columns.

Different partitions contain different rows.

---

## Example

Original Table:

```text
+--------------------------------+
| ID | Name                     |
+--------------------------------+
| 1  | Nitin                    |
| 2  | Rahul                    |
| 3  | Priya                    |
| 4  | Amit                     |
+--------------------------------+
```

After Horizontal Partitioning:

```text
Partition 1

+----------------------+
| 1 | Nitin            |
| 2 | Rahul            |
+----------------------+

Partition 2

+----------------------+
| 3 | Priya            |
| 4 | Amit             |
+----------------------+
```

Same columns.

Different rows.

---

## Real World Example

Orders Table:

```text
2023 Orders

2024 Orders

2025 Orders
```

Queries for 2025 only scan the 2025 partition.

---

## Advantages

- Faster Queries
- Better Maintenance
- Easier Archiving
- Smaller Indexes

---

## Disadvantages

- Complex Queries Across Partitions
- Partition Management Overhead

---

# Vertical Partitioning

Vertical Partitioning divides columns.

Each partition contains different columns.

---

## Example

Original Table:

```text
Users

ID
Name
Email
Profile Picture
Bio
Address
Phone
```

Split into:

```text
Basic User Table

ID
Name
Email
```

and

```text
Profile Table

ID
Profile Picture
Bio
Address
Phone
```

---

## Diagram

```text
             Users

     +-------------------+
     | All Columns       |
     +-------------------+

              │

      ┌───────┴───────┐

      ▼               ▼

+-------------+   +-------------+
| User Core   |   | User Detail |
+-------------+   +-------------+
```

---

## Advantages

- Reduced Row Size
- Faster Reads
- Better Cache Efficiency

---

## Disadvantages

- More Joins
- Increased Complexity

---

# Advantages of Partitioning

```text
✓ Faster Queries

✓ Easier Maintenance

✓ Smaller Indexes

✓ Better Data Management

✓ Easier Archival
```

---

# Disadvantages of Partitioning

```text
✗ More Complex Queries

✗ Additional Management

✗ Uneven Data Distribution

✗ Partition Key Design Required
```

---

# What is Sharding?

Sharding is a special form of horizontal partitioning.

The key difference:

Partitions are stored on different physical machines.

---

## Partitioning

```text
Server A

 ├─ Partition 1
 ├─ Partition 2
 └─ Partition 3
```

---

## Sharding

```text
Shard 1 → Server A

Shard 2 → Server B

Shard 3 → Server C
```

Data is distributed across multiple servers.

---

## Sharding Architecture

```text
                Users

                  │
                  ▼

         +------------------+
         |  Shard Router    |
         +------------------+

             /   |   \

            ▼    ▼    ▼

        Shard1 Shard2 Shard3
```

---

# Why Sharding?

A single machine eventually reaches limits.

```text
CPU Limit

RAM Limit

Storage Limit

Connection Limit
```

Sharding distributes load across multiple machines.

---

# Shard Key

A Shard Key determines:

```text
Which record belongs
to which shard
```

Choosing a shard key is one of the most important design decisions.

Bad shard key:

```text
Country
```

Good shard key:

```text
UserID
```

Usually:

```text
High Cardinality

Even Distribution

Frequently Used
```

---

# Types of Sharding

---

# 1. Range Based Sharding

Data is divided using value ranges.

Example:

```text
User IDs

1 - 1000
1001 - 2000
2001 - 3000
```

---

## Diagram

```text
          UserID

             │

             ▼

      +-------------+
      | Router      |
      +-------------+

         /   |   \

        ▼    ▼    ▼

    Shard1 Shard2 Shard3

      1-1000
   1001-2000
   2001-3000
```

---

## Advantages

- Easy to Understand
- Simple Queries

---

## Disadvantages

- Uneven Distribution
- Hotspots

---

# 2. Hash Based Sharding

Use a hash function.

Formula:

```text
Hash(Key) % NumberOfShards
```

Example:

```text
UserID = 1234

1234 % 4

= 2
```

Store inside:

```text
Shard 2
```

---

## Diagram

```text
UserID = 1234

      │

      ▼

 Hash(1234)

      │

      ▼

 1234 % 4 = 2

      │

      ▼

   Shard 2
```

---

## Advantages

- Excellent Distribution
- Avoids Hotspots

---

## Disadvantages

- Hard Rebalancing
- Range Queries Become Difficult

---

# 3. Directory Based Sharding

Maintain a lookup table.

Example:

```text
UserID → Shard
```

---

## Directory Table

```text
1001 → Shard 1

1002 → Shard 3

1003 → Shard 2
```

---

## Diagram

```text
User

 │

 ▼

Directory Service

 │

 ▼

Target Shard
```

---

## Advantages

- Flexible
- Easy Migration

---

## Disadvantages

- Extra Lookup
- Directory Becomes Critical Component

---

# 4. Geo Based Sharding

Shard data according to geography.

---

## Diagram

```text
              Users

                 │

                 ▼

         +---------------+
         | Geo Router    |
         +---------------+

          /      |      \

         ▼       ▼       ▼

      India     USA    Europe
      Shard    Shard    Shard
```

---

## Advantages

- Lower Latency
- Better Regional Performance

---

## Disadvantages

- Cross Region Queries
- Complex Data Movement

---

# Shard Rebalancing

Over time:

```text
Shard 1 → 50 GB

Shard 2 → 300 GB

Shard 3 → 40 GB
```

Distribution becomes uneven.

Data must be moved.

This process is called:

```text
Rebalancing
```

---

# Hotspot Problem

Bad shard key selection can overload one shard.

Example:

```text
90% Users

      ▼

   Shard 1

5% Users

      ▼

   Shard 2

5% Users

      ▼

   Shard 3
```

Result:

```text
One shard overloaded

Others idle
```

This is called a hotspot.

---

# Cross Shard Queries

Suppose:

```text
User Data → Shard 1

Order Data → Shard 3
```

Query requires both.

Now the system must:

```text
Query Multiple Shards

Merge Results

Return Response
```

Cross-shard queries are expensive.

---

# Partitioning vs Sharding

| Feature | Partitioning | Sharding |
|----------|-------------|-----------|
| Multiple Machines | No | Yes |
| Physical Separation | Usually No | Yes |
| Horizontal Scaling | Limited | Excellent |
| Complexity | Lower | Higher |
| Cost | Lower | Higher |
| Query Performance | Better | Much Better at Scale |

---

# When Not To Use Sharding

Do not shard when:

```text
Data Size Is Small

Traffic Is Low

Single Database Is Sufficient

Operational Complexity Is Not Worth It
```

Sharding introduces significant operational complexity.

It should be adopted only when scaling truly requires it.

---

# Real World Examples

## Instagram

```text
User Data

Photos

Followers

Messages
```

Distributed across shards.

---

## Facebook

```text
Billions of Users

Trillions of Relationships
```

Heavy use of sharding strategies.

---

## Uber

```text
Drivers

Riders

Trips

Payments
```

Often geographically partitioned and sharded.

---

# Summary

- Partitioning divides data into smaller logical pieces.
- Horizontal Partitioning splits rows.
- Vertical Partitioning splits columns.
- Sharding distributes data across multiple physical servers.
- Shard Key selection is critical.
- Common sharding strategies include:
  - Range Based Sharding
  - Hash Based Sharding
  - Directory Based Sharding
  - Geo Based Sharding
- Sharding improves scalability but increases complexity.
- Hotspots, rebalancing, and cross-shard queries are common challenges.
- Most large-scale systems eventually adopt sharding to overcome single database limitations.

---

# Next Chapter

## Day 03 - Database Replication

Topics:

- Primary Replica Architecture
- Read Replicas
- Leader-Follower Replication
- Synchronous Replication
- Asynchronous Replication
- Replication Lag
- Failover
- High Availability