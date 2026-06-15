# Day 05 - Apache Kafka

## Table of Contents

1. Introduction
2. Why Kafka Was Created
3. What is Apache Kafka?
4. Kafka Architecture
5. Event Streaming
6. Topics
7. Partitions
8. Producers
9. Consumers
10. Consumer Groups
11. Brokers
12. ZooKeeper vs KRaft
13. Kafka Cluster
14. Message Flow
15. Offsets
16. Replication
17. Leader and Follower Partitions
18. In-Sync Replicas (ISR)
19. Kafka Delivery Guarantees
20. At Most Once
21. At Least Once
22. Exactly Once
23. Kafka Retention
24. Log Compaction
25. Scaling Kafka
26. Kafka Streams
27. Kafka Connect
28. Schema Registry
29. Event-Driven Architecture
30. Kafka vs RabbitMQ
31. Real World Examples
32. System Design Use Cases
33. Interview Questions
34. Summary

---

# Introduction

Modern systems generate massive amounts of data.

Examples:

```text
Netflix

Uber

LinkedIn

Amazon

Instagram
```

Every second they generate:

```text
User Clicks

Orders

Messages

Payments

Notifications
```

Millions of events occur continuously.

Traditional messaging systems struggled with:

```text
Scale

Speed

Reliability
```

To solve this problem:

```text
Apache Kafka
```

was created.

---

# Why Kafka Was Created

Kafka was originally developed by:

```text
LinkedIn
```

Problem:

```text
Billions Of Events

Multiple Systems

Real-Time Processing
```

LinkedIn needed a system capable of:

```text
High Throughput

Fault Tolerance

Durability

Scalability
```

Traditional systems became bottlenecks.

Kafka was designed as:

```text
Distributed Event Streaming Platform
```

---

# What is Apache Kafka?

Kafka is a distributed platform used for:

```text
Publishing Events

Storing Events

Processing Events

Streaming Events
```

Kafka is often called:

```text
Distributed Commit Log
```

or

```text
Event Streaming Platform
```

---

## Think Of Kafka As

```text
Massive Event Highway
```

Events continuously flow through Kafka.

---

# Kafka Architecture

```text
Producer

    |

    v

  Topic

    |

+---+---+---+

|   |   |   |

Partition1

Partition2

Partition3

    |

Kafka Brokers

    |

Consumers
```

Main components:

```text
Producer

Topic

Partition

Broker

Consumer

Consumer Group
```

---

# Event Streaming

Kafka revolves around:

```text
Events
```

An event represents:

```text
Something Happened
```

Examples:

```text
User Registered

Order Created

Payment Completed

Product Viewed
```

---

## Example Event

```json
{
  "event": "order_created",
  "orderId": 1001,
  "userId": 501
}
```

---

# Topics

A topic is a category of messages.

Examples:

```text
orders

payments

notifications

users
```

Think of topic as:

```text
Database Table
```

for events.

---

## Example

```text
orders Topic

Order1

Order2

Order3
```

---

# Partitions

Topics are divided into:

```text
Partitions
```

Purpose:

```text
Parallel Processing

Scalability

High Throughput
```

---

## Example

```text
Orders Topic

      |

+-----+-----+-----+

|     |     |     |

P1    P2    P3
```

Messages are distributed across partitions.

---

# Producers

Producers publish events.

Examples:

```text
Order Service

Payment Service

User Service
```

Producer sends records into Kafka.

---

## Producer Example

```javascript
producer.send({
  topic: "orders",
  messages: [
    {
      value: JSON.stringify({
        orderId: 1001
      })
    }
  ]
});
```

---

# Consumers

Consumers read events.

Examples:

```text
Analytics Service

Email Service

Notification Service
```

Consumers process data independently.

---

# Consumer Groups

Multiple consumers can belong to one group.

Example:

```text
Consumer Group

   |

+--+--+--+

|  |  |  |

C1 C2 C3
```

Kafka distributes partitions among consumers.

---

## Benefits

```text
Load Balancing

Parallel Processing

Scalability
```

---

# Brokers

A Kafka server is called:

```text
Broker
```

Responsibilities:

```text
Store Messages

Serve Producers

Serve Consumers

Replicate Data
```

---

## Example Cluster

```text
Broker1

Broker2

Broker3
```

Together they form:

```text
Kafka Cluster
```

---

# ZooKeeper vs KRaft

Historically Kafka used:

```text
ZooKeeper
```

For:

```text
Leader Election

Metadata Management

Cluster Coordination
```

---

Modern Kafka uses:

```text
KRaft
```

Benefits:

```text
Simpler Architecture

Better Performance

Less Infrastructure
```

---

# Kafka Cluster

A cluster contains multiple brokers.

Example:

```text
+---------+

Broker1

+---------+

Broker2

+---------+

Broker3
```

Benefits:

```text
High Availability

Fault Tolerance

Horizontal Scaling
```

---

# Message Flow

```text
Producer

   |

Kafka Topic

   |

Partitions

   |

Broker

   |

Consumer
```

---

## Detailed Flow

```text
Producer

    |

Send Event

    |

Topic

    |

Partition

    |

Stored On Broker

    |

Consumer Reads
```

---

# Offsets

Every message gets:

```text
Offset
```

Offset acts like:

```text
Message ID
```

---

Example:

```text
Partition 1

Offset 0

Offset 1

Offset 2

Offset 3
```

Consumers track offsets.

---

# Why Offsets Matter

Consumers can:

```text
Resume Processing

Replay Events

Track Progress
```

---

# Replication

Kafka replicates data across brokers.

Purpose:

```text
Prevent Data Loss
```

---

## Example

```text
Partition

     |

+----+----+----+

|    |    |    |

B1   B2   B3
```

Multiple copies exist.

---

# Leader and Follower Partitions

Each partition has:

```text
Leader

Followers
```

---

## Architecture

```text
Leader

   |

Followers
```

---

Producer writes only to:

```text
Leader
```

Followers copy data.

---

# Example

```text
Leader Partition

Broker1

Followers

Broker2

Broker3
```

---

# In-Sync Replicas (ISR)

ISR:

```text
In Sync Replicas
```

Meaning:

```text
Followers Fully Updated
```

---

Example:

```text
Leader

  |

+--+--+

|     |

F1    F2
```

All replicas remain synchronized.

---

# Kafka Delivery Guarantees

Kafka supports:

```text
At Most Once

At Least Once

Exactly Once
```

---

# At Most Once

Message may be lost.

Never duplicated.

```text
0 or 1 Delivery
```

---

Flow:

```text
Send

ACK Before Processing

Crash

Message Lost
```

---

# At Least Once

Most common mode.

```text
1 or More Deliveries
```

Possible duplicates.

---

Flow:

```text
Process

Crash Before ACK

Retry

Duplicate Delivery
```

---

# Exactly Once

Strongest guarantee.

```text
Exactly One Delivery
```

No duplicates.

No loss.

---

Used in:

```text
Financial Systems

Banking

Payments
```

---

# Kafka Retention

Kafka stores messages even after consumption.

This is different from traditional queues.

---

Example:

```text
Message Consumed

Still Stored
```

---

Retention Options:

```text
1 Day

7 Days

30 Days

Forever
```

---

# Example

```text
Topic

Offset0

Offset1

Offset2

Offset3
```

Messages remain available.

---

# Log Compaction

Kafka can keep only latest value per key.

---

Example

```text
user:1 -> A

user:1 -> B

user:1 -> C
```

After compaction:

```text
user:1 -> C
```

Only latest state remains.

---

# Scaling Kafka

Kafka scales horizontally.

Add more:

```text
Brokers

Partitions

Consumers
```

---

Example:

```text
Before

Broker1

Broker2

After

Broker1

Broker2

Broker3

Broker4
```

Capacity increases.

---

# Kafka Streams

Kafka Streams is a stream processing library.

Allows:

```text
Transform Data

Aggregate Data

Filter Data

Join Streams
```

---

Example

```text
Orders Stream

     |

Filter Paid Orders

     |

Output Topic
```

---

# Kafka Connect

Kafka Connect moves data between:

```text
Kafka

Databases

Cloud Storage

Search Engines
```

Without custom code.

---

Examples:

```text
MySQL

PostgreSQL

MongoDB

ElasticSearch
```

---

# Schema Registry

Used to manage event schemas.

Benefits:

```text
Versioning

Compatibility

Validation
```

---

Example Schema

```json
{
  "name": "Order",
  "fields": [
    "orderId",
    "amount"
  ]
}
```

---

# Event-Driven Architecture

Kafka is widely used for:

```text
EDA
```

(Event Driven Architecture)

---

Traditional Architecture

```text
Service A

   |

Service B

   |

Service C
```

---

Event Driven Architecture

```text
Service A

   |

Kafka

   |

+---+---+---+

|   |   |   |

B   C   D
```

Loose coupling achieved.

---

# Kafka vs RabbitMQ

| Kafka              | RabbitMQ                 |
| ------------------ | ------------------------ |
| Event Streaming    | Message Queue            |
| High Throughput    | Lower Throughput         |
| Data Retention     | Message Removal          |
| Partition Based    | Queue Based              |
| Replay Events      | Limited Replay           |
| Distributed Log    | Traditional Broker       |
| Analytics Friendly | Task Processing Friendly |

---

# When To Use Kafka

Choose Kafka for:

```text
Event Streaming

Analytics

Real-Time Pipelines

Large Scale Systems

Log Collection
```

---

# When To Use RabbitMQ

Choose RabbitMQ for:

```text
Background Jobs

Task Queues

Email Processing

Request Reply Workflows
```

---

# Real World Example — LinkedIn

Kafka was originally created at LinkedIn.

Used for:

```text
User Activity

Feed Updates

Notifications

Analytics
```

Billions of events daily.

---

# Real World Example — Netflix

Kafka processes:

```text
Viewing Events

Recommendations

Monitoring Data

Playback Analytics
```

---

# Real World Example — Uber

Every ride generates:

```text
Driver Events

Passenger Events

Location Updates

Payment Events
```

Kafka streams them in real time.

---

# Real World Example — Amazon

Kafka handles:

```text
Orders

Inventory Updates

Payments

Recommendations
```

---

# Real World Example — Instagram

Kafka processes:

```text
Likes

Comments

Stories

Feed Updates
```

At enormous scale.

---

# System Design Use Cases

## Activity Tracking

```text
User Click

     |

Kafka

     |

Analytics System
```

---

## Log Aggregation

```text
Applications

     |

Kafka

     |

Monitoring Platform
```

---

## Fraud Detection

```text
Transaction

      |

Kafka

      |

Fraud Engine
```

---

## Recommendation Engines

```text
User Actions

      |

Kafka

      |

ML Models
```

---

## Event Sourcing

```text
Every Change

Stored As Event

Inside Kafka
```

---

# Common Challenges

## Partition Skew

One partition receives most traffic.

Problem:

```text
Uneven Load
```

---

## Large Messages

Kafka prefers:

```text
Small Events
```

Store large files elsewhere.

---

## Consumer Lag

Consumers process slower than producers.

Solution:

```text
Scale Consumers

Increase Partitions
```

---

# Interview Questions

### What is Kafka?

Distributed event streaming platform.

---

### What is a topic?

Logical category where events are stored.

---

### What is a partition?

Subdivision of topic enabling scalability.

---

### What is a broker?

Kafka server responsible for storing data.

---

### What is an offset?

Unique position of a message inside a partition.

---

### Why are partitions important?

```text
Scalability

Parallelism

High Throughput
```

---

### What is replication?

Maintaining copies of data across brokers.

---

### Difference between leader and follower?

```text
Leader Handles Reads/Writes

Followers Replicate Data
```

---

### What are consumer groups?

Group of consumers sharing work.

---

### What is ISR?

In-Sync Replicas that are fully synchronized with leader.

---

### What is log compaction?

Keeping latest value for a key while removing older versions.

---

### Difference between Kafka and RabbitMQ?

Kafka focuses on event streaming.

RabbitMQ focuses on task messaging.

---

### Why is Kafka fast?

```text
Sequential Disk Writes

Partitioning

Batch Processing

Zero Copy Transfer
```

---

### What is Exactly Once Semantics?

Guarantees event is processed exactly once.

---

### What is Kafka Connect?

Framework for integrating Kafka with external systems.

---

### What is Kafka Streams?

Library for stream processing directly on Kafka data.

---

# Summary

* Kafka is a distributed event streaming platform.
* Developed originally by LinkedIn.
* Topics store events.
* Partitions enable scalability and parallelism.
* Producers publish events.
* Consumers read events.
* Consumer groups allow load balancing.
* Brokers form Kafka clusters.
* Replication prevents data loss.
* Offsets track consumer progress.
* Kafka supports At Most Once, At Least Once, and Exactly Once delivery.
* Kafka retains events for replay.
* Kafka Streams enables stream processing.
* Kafka Connect integrates external systems.
* Kafka powers modern systems such as Netflix, Uber, LinkedIn, Amazon, and Instagram.
* Kafka is one of the most important technologies in modern distributed systems.

---

# Next Chapter

## Day 07 - API Gateway and Load Balancing

Topics:

* What is an API Gateway?
* Why API Gateways Are Needed
* Reverse Proxy
* Request Routing
* Authentication and Authorization
* Rate Limiting
* API Aggregation
* Service Discovery
* Load Balancing
* Types of Load Balancers
* Round Robin
* Least Connections
* Weighted Load Balancing
* NGINX
* HAProxy
* AWS Application Load Balancer
* Real-World Architectures
* Interview Questions
* Summary
