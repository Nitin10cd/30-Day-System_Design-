# Day 02 - Database Scaling and Replication

## Table of Contents

1. Introduction
2. Why Databases Need Scaling
3. The Single Database Problem
4. What is Database Scaling?
5. Vertical Scaling
6. Horizontal Scaling
7. Vertical Scaling vs Horizontal Scaling
8. Database Replication
9. Why Replication?
10. Primary-Replica Architecture
11. Replication Workflow
12. Types of Replication
    - Synchronous Replication
    - Asynchronous Replication
12. Replication Lag
13. Failover
14. High Availability
15. Read Replicas
16. Scaling Evolution of Real Systems
17. Summary

---

# Introduction

Every successful application eventually encounters a database scaling problem.

Initially, a single database server can comfortably handle all operations.

```text
Users      : 100

Orders     : 1,000

Traffic    : 100 Requests/Minute

Storage    : 100 MB
```

As the application grows:

```text
Users      : 10 Million

Orders     : 500 Million

Traffic    : Thousands of Requests/Second

Storage    : Multiple Terabytes
```

The database becomes one of the biggest bottlenecks in the entire system.

This introduces a fundamental challenge:

```text
How do we make the database
handle more traffic,
more data,
and more users?
```

The answer is:

```text
Database Scaling
```

---

# Why Databases Need Scaling

Every database server has physical limitations.

```text
CPU

RAM

Disk

Network Bandwidth

Maximum Connections
```

No machine can scale infinitely.

Eventually:

```text
Queries Become Slow

Response Times Increase

Timeouts Occur

CPU Usage Spikes

Memory Gets Exhausted
```

Example:

```text
CPU Usage     : 98%

RAM Usage     : 95%

Disk Usage    : 90%
```

At this point the database becomes the bottleneck of the application.

---

# The Single Database Problem

Most applications start like this:

```text
          Users

             │

             ▼

      +-------------+
      | Application |
      +-------------+

             │

             ▼

      +-------------+
      | Database    |
      +-------------+
```

This architecture is simple and works well for small systems.

However as traffic grows:

```text
More Users

More Reads

More Writes

More Data
```

everything hits the same database.

Eventually:

```text
Database Becomes Overloaded
```

---

# What is Database Scaling?

Database Scaling means:

> Increasing the database's ability to handle more traffic, more users, and more data.

There are two primary approaches:

```text
Database Scaling

        │

        ├── Vertical Scaling

        │

        └── Horizontal Scaling
```

---

# Vertical Scaling

Vertical Scaling means:

> Increasing the resources of an existing database server.

Instead of adding more machines, we upgrade the current machine.

---

## Example

Before:

```text
CPU      : 4 Cores

RAM      : 8 GB

Storage  : 256 GB SSD
```

After Upgrade:

```text
CPU      : 32 Cores

RAM      : 128 GB

Storage  : 4 TB SSD
```

---

## Architecture

Before:

```text
           Users

             │

             ▼

      +-------------+
      | Database    |
      +-------------+

       4 CPU
       8 GB RAM
```

After Upgrade:

```text
           Users

             │

             ▼

      +-------------+
      | Database    |
      +-------------+

      32 CPU
     128 GB RAM
```

Same database.

Bigger machine.

---

## Advantages

### Simplicity

No architecture changes.

Application code remains unchanged.

---

### Easy To Implement

Upgrade hardware and restart services.

---

### Strong Consistency

All data exists on a single machine.

Transactions remain straightforward.

---

### Lower Operational Complexity

No distributed systems challenges.

No sharding.

No replication management.

---

## Disadvantages

### Hardware Limits

A machine cannot grow forever.

Eventually maximum hardware capacity is reached.

---

### Expensive

Larger servers become exponentially more expensive.

---

### Single Point Of Failure

```text
Database Failure

      │

      ▼

Entire System Affected
```

---

### Limited Scalability

At some point upgrading hardware stops helping.

---

# Horizontal Scaling

Horizontal Scaling means:

> Adding more database servers instead of upgrading one server.

Rather than building one giant machine, we distribute work across multiple machines.

---

## Architecture

Single Database:

```text
          Users

             │

             ▼

      +-------------+
      | Database    |
      +-------------+
```

Horizontal Scaling:

```text
                Users

                   │

                   ▼

          +----------------+
          | Load Balancer  |
          +----------------+

             /     |     \

            ▼      ▼      ▼

         DB1     DB2     DB3
```

Workload is distributed among multiple servers.

---

## Example

Single Server Capacity:

```text
1000 Requests/Second
```

Three Servers:

```text
1000 Requests/Second

1000 Requests/Second

1000 Requests/Second
```

Total Capacity:

```text
3000 Requests/Second
```

---

## Advantages

### Massive Scalability

Additional servers can be added whenever required.

---

### Better Availability

Failure of one server does not necessarily bring down the entire system.

---

### Better Fault Tolerance

Traffic can be routed to healthy servers.

---

### Better Load Distribution

Workload is spread across multiple machines.

---

## Disadvantages

### More Complex Architecture

Distributed systems introduce additional complexity.

---

### Data Distribution Challenges

Questions arise:

```text
Which Server Stores Which Data?

How Is Data Located?

How Is Data Moved?
```

---

### Consistency Problems

Multiple copies of data may exist.

Keeping them synchronized becomes difficult.

---

### Network Failures

Machines communicate over networks.

Networks can fail.

---

# Vertical Scaling vs Horizontal Scaling

| Feature | Vertical Scaling | Horizontal Scaling |
|----------|-----------------|-------------------|
| Strategy | Bigger Machine | More Machines |
| Complexity | Low | High |
| Scalability | Limited | Very High |
| Cost Initially | Lower | Higher |
| Fault Tolerance | Poor | Better |
| Availability | Lower | Higher |
| Single Point of Failure | Yes | Reduced |
| Used By Small Systems | Yes | Sometimes |
| Used By Large Systems | Rarely | Almost Always |

---

# Database Replication

Scaling solves performance problems.

However another important problem remains:

```text
What happens if the database crashes?
```

Replication solves this problem.

---

# What is Replication?

Replication is the process of maintaining multiple copies of the same database.

Instead of storing data on a single server:

```text
Database
```

we maintain copies.

```text
Primary Database

Replica Database 1

Replica Database 2

Replica Database 3
```

Each replica stores the same data.

---

# Why Replication?

Replication provides:

```text
Higher Availability

Fault Tolerance

Read Scalability

Disaster Recovery

Backup Databases
```

---

# Primary-Replica Architecture

The most common replication architecture is:

```text
Primary Database

       │

       ▼

Replica Databases
```

---

## Architecture

```text
                  Users

                     │

      ┌──────────────┴──────────────┐

      ▼                             ▼

   Writes                         Reads

      │                             │

      ▼                             ▼

+----------------+          +---------------+
| Primary DB     |          | Replica DB 1  |
+----------------+          +---------------+

        │

        ▼

+----------------+
| Replica DB 2   |
+----------------+

        │

        ▼

+----------------+
| Replica DB 3   |
+----------------+
```

---

# Replication Workflow

Suppose a user registers.

```sql
INSERT INTO users(name)
VALUES('Nitin');
```

Step 1:

```text
Write Goes To Primary
```

Step 2:

```text
Primary Stores Data
```

Step 3:

```text
Primary Sends Changes
To Replicas
```

Step 4:

```text
Replicas Apply Changes
```

Eventually every database contains the same data.

---

# Types of Replication

```text
Replication

      │

      ├── Synchronous

      │

      └── Asynchronous
```

---

# Synchronous Replication

In synchronous replication:

> Primary waits for replicas to acknowledge the write before responding to the client.

---

## Flow

```text
Client

  │

  ▼

Primary

  │

  ▼

Replica 1

  │

  ▼

Replica 2

  │

  ▼

ACK

  │

  ▼

Client Success
```

---

## Advantages

```text
Strong Consistency

No Data Loss

Reliable
```

---

## Disadvantages

```text
Higher Latency

Slower Writes

Replica Failures Affect Writes
```

---

# Asynchronous Replication

In asynchronous replication:

> Primary immediately responds to the client and updates replicas later.

---

## Flow

```text
Client

   │

   ▼

Primary

   │

   ├────────► Client Success

   │

   ▼

Replica 1

   ▼

Replica 2
```

---

## Advantages

```text
Fast Writes

Better Performance

Lower Latency
```

---

## Disadvantages

```text
Possible Data Loss

Temporary Inconsistency
```

---

# Replication Lag

Replication is not always instantaneous.

Example:

```text
Primary Updated

Replica Not Updated Yet
```

This delay is called:

```text
Replication Lag
```

---

## Example

```text
Time 10:00:00

User Updates Profile
```

Primary:

```text
New Name Stored
```

Replica:

```text
Still Has Old Name
```

For a short duration both databases contain different data.

---

# Failover

Suppose the primary database crashes.

```text
Primary Down
```

Without failover:

```text
System Unavailable
```

With failover:

```text
Replica Promoted

New Primary Created
```

---

## Failover Diagram

Before:

```text
Primary

   │

   ▼

Replica
```

After Failure:

```text
Replica

Becomes

Primary
```

System continues operating.

---

# High Availability

High Availability means:

> The system remains available despite failures.

Replication is one of the primary techniques used to achieve high availability.

---

## Example

```text
Primary Down

Replica Available
```

Users continue using the system.

---

# Read Replicas

Read-heavy applications often use replicas for read traffic.

Example:

```text
Writes

    ▼

Primary DB
```

```text
Reads

    ▼

Replica DB 1

Replica DB 2

Replica DB 3
```

---

## Architecture

```text
                    Users

                       │

        ┌──────────────┴──────────────┐

        ▼                             ▼

     Writes                        Reads

        ▼                             ▼

 +----------------+         +----------------+
 | Primary DB     |         | Replica DB 1   |
 +----------------+         +----------------+

         │

         ▼

 +----------------+
 | Replica DB 2   |
 +----------------+

         │

         ▼

 +----------------+
 | Replica DB 3   |
 +----------------+
```

This significantly reduces load on the primary database.

---

# Scaling Evolution of Real Systems

Most companies follow this progression.

---

## Stage 1

```text
Application

      │

      ▼

Single Database
```

---

## Stage 2

```text
Application

      │

      ▼

Bigger Database
```

Vertical Scaling.

---

## Stage 3

```text
Application

      │

      ▼

Primary Database

      │

      ▼

Read Replicas
```

Replication.

---

## Stage 4

```text
Application

      │

      ▼

Multiple Databases
```

Horizontal Scaling.

---

## Stage 5

```text
Replication

Partitioning

Sharding

Distributed Databases
```

Internet Scale Architecture.

---

# Summary

- Every database eventually reaches hardware limits.
- Database scaling helps support more users, traffic, and data.
- Vertical Scaling increases machine capacity.
- Horizontal Scaling adds more machines.
- Vertical Scaling is simpler but limited.
- Horizontal Scaling provides much greater scalability.
- Replication maintains multiple copies of the same database.
- Replication improves availability and fault tolerance.
- Primary-Replica architecture is the most common replication model.
- Synchronous replication prioritizes consistency.
- Asynchronous replication prioritizes performance.
- Replication lag is a common challenge.
- Failover improves availability during failures.
- Read replicas help scale read-heavy systems.
- Replication is usually the first step before partitioning and sharding.

---

# Next Chapter

## Day 02 - Database Partitioning and Sharding

Topics:

- Horizontal Partitioning
- Vertical Partitioning
- Shard Keys
- Range Based Sharding
- Hash Based Sharding
- Directory Based Sharding
- Geo Based Sharding
- Rebalancing
- Hotspots
- Cross Shard Queries