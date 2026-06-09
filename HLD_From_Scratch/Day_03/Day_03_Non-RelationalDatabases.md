# Day 03 - Non-Relational Databases (NoSQL Databases)

## Table of Contents

1. Introduction
2. Why Traditional Databases Are Not Always Enough
3. What is a NoSQL Database?
4. SQL vs NoSQL
5. Characteristics of NoSQL Databases
6. CAP Theorem
7. Types of NoSQL Databases

   * Key-Value Databases
   * Document Databases
   * Column-Family Databases
   * Graph Databases
8. Key-Value Databases
9. Redis
10. Amazon DynamoDB
11. Document Databases
12. MongoDB
13. CouchDB
14. Column-Family Databases
15. Cassandra
16. HBase
17. Graph Databases
18. Neo4j
19. ArangoDB
20. Data Modeling in NoSQL
21. Denormalization
22. Eventual Consistency
23. Sharding in NoSQL
24. Replication in NoSQL
25. NoSQL Database Comparison
26. How to Choose a NoSQL Database
27. Real-World Examples
28. SQL vs NoSQL Decision Matrix
29. Interview Questions
30. Summary

---

# Introduction

As applications grow, traditional relational databases begin facing challenges.

Examples:

```text
Facebook

Instagram

Netflix

Amazon

Uber
```

These systems handle:

```text
Billions of Users

Petabytes of Data

Millions of Requests Per Second

Globally Distributed Traffic
```

Managing such scale using only relational databases becomes difficult.

To solve these challenges, a new category of databases emerged:

```text
NoSQL Databases
```

Also known as:

```text
Non-Relational Databases
```

---

# Why Traditional Databases Are Not Always Enough

Relational databases are excellent for:

```text
Transactions

Banking Systems

ERP Systems

Structured Data
```

However, modern applications often require:

```text
Massive Scalability

Flexible Schemas

Fast Writes

Distributed Systems
```

Challenges:

```text
Horizontal Scaling Is Difficult

Rigid Schema Design

Expensive Joins

Distributed Transactions
```

This led to the rise of NoSQL databases.

---

# What is a NoSQL Database?

NoSQL means:

```text
Not Only SQL
```

A NoSQL database stores data without relying on traditional relational tables.

Instead of:

```text
Rows

Columns

Foreign Keys

Joins
```

NoSQL databases use:

```text
Documents

Key-Value Pairs

Graphs

Column Families
```

Example:

User Profile

```json
{
  "id": 1,
  "name": "Nitin",
  "skills": [
    "Java",
    "Spring Boot",
    "System Design"
  ]
}
```

Entire object stored together.

---

# SQL vs NoSQL

| Feature      | SQL         | NoSQL              |
| ------------ | ----------- | ------------------ |
| Schema       | Fixed       | Flexible           |
| Scaling      | Vertical    | Horizontal         |
| Joins        | Supported   | Limited            |
| Transactions | Strong ACID | Often Eventual     |
| Flexibility  | Low         | High               |
| Performance  | Good        | Excellent at Scale |
| Structure    | Tables      | Multiple Models    |
| Distributed  | Difficult   | Native Support     |

---

# Characteristics of NoSQL Databases

Most NoSQL databases provide:

```text
Horizontal Scaling

Schema Flexibility

High Availability

Replication

Partitioning

Fast Reads/Writes
```

---

# CAP Theorem

One of the most important concepts in distributed databases.

CAP stands for:

```text
Consistency

Availability

Partition Tolerance
```

A distributed system can guarantee only two of the three.

---

## Consistency

Every node sees the same data.

Example:

```text
User Updates Profile

Every Server Immediately Sees Change
```

---

## Availability

System always responds.

Example:

```text
Even During Failures

Requests Continue Working
```

---

## Partition Tolerance

System continues operating despite network failures.

Example:

```text
Server A Cannot Reach Server B

System Still Functions
```

---

# Types of NoSQL Databases

```text
NoSQL

   |

   +---- Key-Value

   |

   +---- Document

   |

   +---- Column Family

   |

   +---- Graph
```

---

# Key-Value Databases

Simplest NoSQL model.

Structure:

```text
Key → Value
```

Example:

```text
user:1001 → Nitin

user:1002 → Rahul
```

Think of it as a giant hashmap.

---

# Redis

Most popular key-value database.

Data:

```text
Key → Value
```

Example:

```text
session_123 → User Data
```

Uses:

```text
Caching

Session Storage

Leaderboards

Rate Limiting
```

Advantages:

```text
Extremely Fast

In-Memory Storage

Low Latency
```

---

# Amazon DynamoDB

AWS managed key-value database.

Features:

```text
Automatic Scaling

High Availability

Serverless

Managed Infrastructure
```

Used For:

```text
Gaming

IoT

E-Commerce
```

---

# Document Databases

Store data as documents.

Usually JSON-like structures.

Example:

```json
{
  "id": 1,
  "name": "Nitin",
  "email": "nitin@gmail.com",
  "skills": [
    "Java",
    "Spring Boot"
  ]
}
```

---

# MongoDB

Most popular document database.

Data stored as:

```text
Collections

Documents
```

Instead of:

```text
Tables

Rows
```

Example:

```json
{
  "name": "Laptop",
  "price": 50000,
  "brand": "Dell"
}
```

Advantages:

```text
Flexible Schema

Easy Development

Horizontal Scaling
```

Best For:

```text
Content Platforms

E-Commerce

Social Media Applications
```

---

# CouchDB

Document-oriented database.

Features:

```text
JSON Storage

Offline Synchronization

Replication
```

Used For:

```text
Mobile Applications

Distributed Applications
```

---

# Column-Family Databases

Designed for massive datasets.

Store data in:

```text
Column Families
```

Instead of rows.

Optimized for:

```text
Big Data

Analytics

High Write Throughput
```

---

# Cassandra

Developed at Facebook.

Designed for:

```text
Massive Scalability

Fault Tolerance

Distributed Systems
```

Features:

```text
No Single Point Of Failure

Multi Data Center Support

High Availability
```

Used By:

```text
Netflix

Uber

Spotify
```

---

# HBase

Built on Hadoop.

Designed for:

```text
Big Data Processing

Large Scale Analytics
```

Best For:

```text
Petabyte Scale Storage
```

---

# Graph Databases

Store relationships as first-class citizens.

Structure:

```text
Nodes

Edges

Properties
```

Example:

```text
User A

  |

Friend

  |

User B
```

---

# Neo4j

Most popular graph database.

Perfect for:

```text
Social Networks

Fraud Detection

Recommendation Systems

Knowledge Graphs
```

Advantages:

```text
Fast Relationship Traversal

Complex Graph Queries
```

---

# ArangoDB

Multi-model database.

Supports:

```text
Documents

Graphs

Key-Value
```

Useful when applications need multiple models.

---

# Data Modeling in NoSQL

Relational Databases:

```text
Normalization
```

NoSQL Databases:

```text
Denormalization
```

---

# Denormalization

Instead of splitting data:

```text
Users Table

Orders Table
```

NoSQL often stores related data together.

Example:

```json
{
  "user": "Nitin",
  "orders": [
    {
      "product": "Laptop"
    },
    {
      "product": "Phone"
    }
  ]
}
```

Benefits:

```text
Fewer Queries

Faster Reads
```

---

# Eventual Consistency

Many NoSQL databases prioritize availability.

Example:

```text
Write On Server A
```

Immediately:

```text
Server B May Not Have Latest Data
```

Eventually:

```text
All Servers Synchronize
```

This is called:

```text
Eventual Consistency
```

---

# Sharding in NoSQL

Data is split across multiple servers.

Example:

```text
Users 1-1M  → Server 1

Users 1M-2M → Server 2

Users 2M-3M → Server 3
```

Benefits:

```text
Unlimited Horizontal Scaling
```

---

# Replication in NoSQL

Multiple copies of data are maintained.

Example:

```text
Primary Node

     |

Replica 1

Replica 2

Replica 3
```

Benefits:

```text
High Availability

Fault Tolerance

Disaster Recovery
```

---

# NoSQL Database Comparison

| Database  | Type          | Best For                |
| --------- | ------------- | ----------------------- |
| Redis     | Key-Value     | Cache                   |
| DynamoDB  | Key-Value     | Serverless Applications |
| MongoDB   | Document      | General Purpose Apps    |
| CouchDB   | Document      | Offline Sync            |
| Cassandra | Column Family | Massive Scale           |
| HBase     | Column Family | Big Data                |
| Neo4j     | Graph         | Relationships           |
| ArangoDB  | Multi Model   | Hybrid Applications     |

---

# How to Choose a NoSQL Database

Choose based on data access patterns.

---

## Need Caching?

Choose:

```text
Redis
```

---

## Need Flexible JSON Storage?

Choose:

```text
MongoDB
```

---

## Need Massive Scalability?

Choose:

```text
Cassandra
```

---

## Need Relationship Queries?

Choose:

```text
Neo4j
```

---

## AWS Native Application?

Choose:

```text
DynamoDB
```

---

# Real-World Examples

## Netflix

Uses:

```text
Cassandra
```

Reason:

```text
Massive Scale

Global Availability
```

---

## Instagram

Uses:

```text
Redis

Cassandra
```

For caching and large-scale data.

---

## Uber

Uses:

```text
Cassandra
```

For distributed storage.

---

## LinkedIn

Uses:

```text
Neo4j-like Graph Concepts
```

For relationship-based recommendations.

---

# SQL vs NoSQL Decision Matrix

| Scenario              | Recommended Database |
| --------------------- | -------------------- |
| Banking               | SQL                  |
| E-Commerce            | SQL + NoSQL          |
| Social Network        | NoSQL                |
| Chat Application      | NoSQL                |
| Analytics Platform    | NoSQL                |
| Inventory Management  | SQL                  |
| Real-Time Gaming      | NoSQL                |
| Recommendation Engine | Graph Database       |

---

# Interview Questions

### What is NoSQL?

A non-relational database designed for scalability, flexibility, and distributed systems.

---

### What are the four types of NoSQL databases?

```text
Key-Value

Document

Column-Family

Graph
```

---

### What is CAP Theorem?

A distributed system can guarantee only two of:

```text
Consistency

Availability

Partition Tolerance
```

---

### Why is MongoDB popular?

```text
Flexible Schema

Easy Development

JSON Documents

Horizontal Scaling
```

---

### When should Cassandra be used?

```text
Massive Scale

High Availability

Distributed Systems
```

---

### Why is Redis so fast?

```text
In-Memory Storage
```

---

# Summary

* NoSQL means "Not Only SQL."
* NoSQL databases are designed for scalability and flexibility.
* Four major categories exist:

  * Key-Value
  * Document
  * Column-Family
  * Graph
* Redis dominates caching workloads.
* MongoDB is the most popular document database.
* Cassandra excels at internet-scale systems.
* Neo4j is optimized for relationship-heavy data.
* NoSQL databases often favor eventual consistency.
* Horizontal scaling is a core strength of NoSQL.
* Choosing a database depends on access patterns and scalability requirements.

---

# Next Chapter

## Day 04 - Database Indexing and Query Optimization

Topics:

* What is an Index?
* Why Queries Become Slow
* B-Tree Index
* Hash Index
* Clustered Index
* Non-Clustered Index
* Composite Index
* Covering Index
* Query Execution Plans
* EXPLAIN Command
* Full Table Scans
* Query Optimization Techniques
* Database Performance Tuning
* Real-World Indexing Strategies
