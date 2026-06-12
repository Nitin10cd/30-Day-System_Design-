# Day 04 - Publish Subscribe (Pub/Sub)

## Table of Contents

1. Introduction
2. Why Pub/Sub is Needed
3. What is Publish Subscribe?
4. Components of Pub/Sub
5. How Pub/Sub Works
6. Publisher
7. Subscriber
8. Topics
9. Message Broker
10. Pub/Sub vs Traditional Communication
11. Advantages of Pub/Sub
12. Message Flow Architecture
13. Fan-Out Pattern
14. Event-Driven Architecture
15. Delivery Guarantees
16. Message Ordering
17. Dead Letter Queues (DLQ)
18. Message Retention
19. Redis Pub/Sub
20. Apache Kafka
21. RabbitMQ
22. AWS SNS
23. Google Pub/Sub
24. Real-World Examples
25. System Design Use Cases
26. Challenges in Pub/Sub
27. Interview Questions
28. Summary

---

# Introduction

Modern applications consist of multiple services.

Examples:

```text
User Service

Notification Service

Email Service

Analytics Service

Payment Service
```

When one service performs an action, multiple other services may need to react.

Example:

```text
User Places Order
```

Then:

```text
Send Email

Update Inventory

Generate Invoice

Track Analytics
```

Direct communication becomes difficult.

To solve this:

```text
Publish Subscribe (Pub/Sub)
```

---

# Why Pub/Sub is Needed

Imagine an E-Commerce Application.

Without Pub/Sub:

```text
Order Service

   |

   +---- Email Service

   |

   +---- Analytics Service

   |

   +---- Inventory Service

   |

   +---- Billing Service
```

Problems:

```text
Tight Coupling

Hard To Scale

Difficult Maintenance

Service Dependencies
```

As services increase:

```text
System Complexity Increases
```

Pub/Sub solves this problem.

---

# What is Publish Subscribe?

Publish Subscribe is a messaging pattern where:

```text
Publishers Send Messages

Subscribers Receive Messages

Publisher Does Not Know Subscribers

Subscribers Do Not Know Publisher
```

Communication happens through:

```text
Message Broker
```

---

# Components of Pub/Sub

```text
Publisher

Topic

Message Broker

Subscriber
```

Architecture:

```text
Publisher

    |

    v

Message Broker

    |

+---+---+---+

|       |    |

Sub1   Sub2 Sub3
```

---

# How Pub/Sub Works

Step 1:

```text
Publisher Creates Message
```

Step 2:

```text
Message Sent To Topic
```

Step 3:

```text
Broker Receives Message
```

Step 4:

```text
Broker Forwards Message
```

Step 5:

```text
Subscribers Consume Message
```

---

# Publisher

Publisher is responsible for producing messages.

Example:

```text
Order Created

User Registered

Payment Completed
```

Publisher only publishes.

It does not care who consumes.

---

## JavaScript Example

```javascript
publish("order-created", {
  orderId: 101,
  amount: 500
});
```

---

# Subscriber

Subscriber listens to topics.

Example:

```text
Email Service

Analytics Service

Inventory Service
```

When message arrives:

```text
Process Event
```

---

## JavaScript Example

```javascript
subscribe("order-created", (data) => {
  console.log(data);
});
```

---

# Topics

Topics act as channels.

Example:

```text
user-created

payment-success

order-created

order-cancelled
```

Architecture:

```text
Topic

  |

+---+---+---+

|       |    |

S1      S2   S3
```

All subscribers receive message.

---

# Message Broker

Central component of Pub/Sub.

Responsibilities:

```text
Receive Messages

Store Messages

Route Messages

Deliver Messages
```

Examples:

```text
Kafka

RabbitMQ

Redis

AWS SNS

Google Pub/Sub
```

---

# Pub/Sub vs Traditional Communication

## Direct Communication

```text
Service A

   |

Service B
```

Problems:

```text
Tight Coupling

Dependency Management
```

---

## Pub/Sub

```text
Service A

   |

Broker

   |

Service B

Service C

Service D
```

Advantages:

```text
Loose Coupling

Scalability

Flexibility
```

---

# Advantages of Pub/Sub

```text
Loose Coupling

Asynchronous Communication

Scalable

Fault Tolerant

Easy Integration

Independent Services
```

---

# Message Flow Architecture

```text
Order Service

      |

Publish Event

      |

      v

Kafka Topic

      |

+-----+-----+-----+

|           |     |

Email    Analytics Inventory

Service   Service   Service
```

---

# Fan-Out Pattern

One message delivered to multiple consumers.

Example:

```text
Order Placed
```

Triggers:

```text
Email

SMS

Analytics

Inventory Update
```

Architecture:

```text
Publisher

    |

Topic

    |

+---+---+---+---+

|   |   |   |   |

E   S   A   I
```

---

# Event-Driven Architecture

Pub/Sub is foundation of:

```text
Event Driven Systems
```

Example:

```text
User Registered
```

Event:

```text
user-created
```

Consumers:

```text
Welcome Email

Profile Service

Analytics
```

---

# Delivery Guarantees

---

## At Most Once

```text
Delivered Once

May Lose Message
```

Fastest.

---

## At Least Once

```text
Message Delivered

Possible Duplicates
```

Most common.

---

## Exactly Once

```text
No Duplicates

No Loss
```

Most expensive.

---

# Message Ordering

Sometimes order matters.

Example:

```text
Order Created

Order Paid

Order Shipped
```

Wrong order:

```text
Shipped

Created

Paid
```

Creates issues.

Kafka supports partition ordering.

---

# Dead Letter Queue (DLQ)

Failed messages should not disappear.

Example:

```text
Message Failed

    |

Move To

    |

DLQ
```

Architecture:

```text
Producer

   |

Broker

   |

Consumer

   |

Failure

   |

DLQ
```

Benefits:

```text
Retry Later

Debug Errors
```

---

# Message Retention

Messages can be stored temporarily.

Example:

```text
Retain For

1 Day

7 Days

30 Days
```

Useful for:

```text
Replay

Recovery

Auditing
```

---

# Redis Pub/Sub

Simple Pub/Sub implementation.

Architecture:

```text
Publisher

   |

Redis

   |

Subscribers
```

---

## JavaScript Example

Publisher:

```javascript
await redis.publish(
  "orders",
  JSON.stringify({
    orderId: 101
  })
);
```

Subscriber:

```javascript
redis.subscribe("orders");

redis.on("message", (channel, msg) => {
  console.log(msg);
});
```

---

# Apache Kafka

Most popular event streaming platform.

Designed for:

```text
High Throughput

Fault Tolerance

Distributed Systems
```

Architecture:

```text
Producer

    |

Topic

    |

Partition

    |

Consumer Group
```

---

# Kafka Architecture

```text
Producer

    |

Kafka Broker

    |

+----+----+----+

|         |    |

P0       P1   P2

    |

Consumer Group
```

Advantages:

```text
Massive Scalability

Persistence

Replay Support
```

---

# RabbitMQ

Message Queue System.

Uses:

```text
Queues

Exchanges

Routing Keys
```

Architecture:

```text
Producer

   |

Exchange

   |

Queue

   |

Consumer
```

Best For:

```text
Task Processing

Background Jobs
```

---

# AWS SNS

Amazon Simple Notification Service.

Features:

```text
Fully Managed

Scalable

Serverless
```

Supports:

```text
Email

SMS

Lambda

SQS
```

---

# Google Pub/Sub

Google Cloud messaging platform.

Features:

```text
Global Scale

High Availability

Managed Infrastructure
```

Used in:

```text
Real-Time Analytics

Microservices
```

---

# Real-World Examples

## YouTube

Event:

```text
Video Uploaded
```

Triggers:

```text
Transcoding

Notifications

Analytics
```

---

## Amazon

Event:

```text
Order Placed
```

Triggers:

```text
Inventory Update

Billing

Shipping

Email
```

---

## Uber

Event:

```text
Ride Completed
```

Triggers:

```text
Billing

Driver Payment

Analytics

Notifications
```

---

# System Design Use Cases

## Notification System

```text
User Action

    |

Publish Event

    |

Notification Service
```

---

## Payment Processing

```text
Payment Success

      |

Publish Event

      |

Invoice Service

Email Service

Analytics Service
```

---

## Microservices Communication

```text
Service A

Service B

Service C

Service D
```

Connected through:

```text
Kafka
```

Instead of direct API calls.

---

# Challenges in Pub/Sub

```text
Message Duplication

Message Ordering

Consumer Failures

Network Partitions

Retry Handling

Dead Letter Processing
```

---

# Interview Questions

### What is Pub/Sub?

A messaging pattern where publishers send messages and subscribers receive them through a broker.

---

### Why use Pub/Sub?

```text
Loose Coupling

Scalability

Asynchronous Communication
```

---

### Difference Between Queue and Pub/Sub?

Queue:

```text
One Consumer Receives Message
```

Pub/Sub:

```text
Multiple Consumers Receive Same Message
```

---

### What is Kafka?

A distributed event streaming platform used for large-scale messaging.

---

### What is a Topic?

A logical channel where publishers send messages and subscribers listen.

---

### What is a Dead Letter Queue?

Failed messages are moved to a separate queue for later processing.

---

### What are Delivery Guarantees?

```text
At Most Once

At Least Once

Exactly Once
```

---

### Why is Kafka popular?

```text
High Throughput

Persistence

Scalability

Fault Tolerance
```

---

# Summary

* Pub/Sub enables asynchronous communication.
* Publishers and subscribers are loosely coupled.
* Topics act as communication channels.
* Brokers manage message routing.
* Kafka is the most popular distributed Pub/Sub system.
* Redis provides lightweight Pub/Sub.
* RabbitMQ is excellent for task processing.
* DLQs handle failed messages.
* Event-driven architecture heavily relies on Pub/Sub.
* Large-scale systems use Pub/Sub for scalability and reliability.

---

# Next Chapter

## Day 06 - Message Queues

Topics:

* What is a Message Queue?
* Queue Architecture
* Producer and Consumer
* FIFO Queues
* Priority Queues
* Message Acknowledgements
* Retries
* Dead Letter Queues
* RabbitMQ
* Kafka Queues
* Amazon SQS
* Queue Design Patterns
* Distributed Messaging
* System Design Use Cases
