# Day 04 - Caching

## Table of Contents

1. Introduction
2. Why Caching is Needed
3. What is Caching?
4. How Caching Works
5. Cache Hit vs Cache Miss
6. Benefits of Caching
7. Types of Caching
8. Client-Side Caching
9. Browser Caching
10. CDN Caching
11. Server-Side Caching
12. Database Caching
13. In-Memory Caching
14. Distributed Caching
15. Redis
16. Memcached
17. Cache Eviction Policies
18. Cache Invalidation
19. Write Strategies
20. Cache Consistency Challenges
21. Cache Stampede
22. Cache Penetration
23. Cache Breakdown
24. Real-World Examples
25. Caching Design Patterns
26. Interview Questions
27. Summary

---

# Introduction

Modern applications serve millions of users.

Examples:

```text
YouTube

Instagram

Netflix

Amazon

Facebook
```

Users expect responses in:

```text
Milliseconds
```

However fetching data directly from databases every time is expensive.

Without caching:

```text
Request

   |

Database Query

   |

Database Processing

   |

Response
```

This creates:

```text
High Latency

Database Load

Slow User Experience
```

To solve this problem:

```text
Caching
```

is introduced.

---

# Why Caching is Needed

Imagine:

```text
1 Million Users

Reading Same Product

Every Second
```

Without caching:

```text
1 Million Database Queries
```

Database becomes overloaded.

With caching:

```text
First Request

   |

Database

   |

Cache

Subsequent Requests

   |

Cache
```

Database load drops dramatically.

---

# What is Caching?

Caching is the process of storing frequently accessed data in a faster storage layer.

Goal:

```text
Reduce Latency

Reduce Database Load

Improve Scalability
```

Think of cache as:

```text
A Shortcut To Data
```

---

# How Caching Works

```text
User Request

      |

      v

Check Cache

      |

 +----+----+

 |         |

Hit      Miss

 |         |

 v         v

Return   Database

Data        |

            v

        Store In Cache

            |

            v

         Return Data
```

---

# Cache Hit vs Cache Miss

## Cache Hit

Requested data exists in cache.

```text
User Request

     |

Cache

     |

Data Found

     |

Response
```

Fast response.

---

## Cache Miss

Requested data not found.

```text
User Request

     |

Cache

     |

Data Not Found

     |

Database

     |

Store In Cache

     |

Response
```

Slower than cache hit.

---

# Benefits of Caching

```text
Faster Responses

Reduced Database Load

Improved Scalability

Better User Experience

Reduced Infrastructure Costs
```

---

# Types of Caching

```text
Caching

   |

   +---- Client Side Cache

   |

   +---- Browser Cache

   |

   +---- CDN Cache

   |

   +---- Server Cache

   |

   +---- Database Cache

   |

   +---- Distributed Cache
```

---

# Client-Side Caching

Data stored on user device.

Examples:

```text
Local Storage

Session Storage

Mobile App Cache
```

---

## JavaScript Example

```javascript
localStorage.setItem("username", "Nitin");

const user = localStorage.getItem("username");

console.log(user);
```

Output:

```text
Nitin
```

---

# Browser Caching

Browser stores:

```text
CSS

JavaScript

Images

Fonts
```

Example:

```text
First Visit

     |

Download Files

     |

Store In Browser Cache

Second Visit

     |

Use Cached Files
```

Website loads faster.

---

# CDN Caching

CDN:

```text
Content Delivery Network
```

Examples:

```text
Cloudflare

Akamai

AWS CloudFront
```

---

## CDN Architecture

```text
User

   |

Nearest CDN

   |

Origin Server
```

Static files served from nearest location.

---

# Server-Side Caching

Cache stored on backend servers.

Example:

```text
API Response Cache

HTML Cache

Session Cache
```

---

## Architecture

```text
User

  |

Server

  |

Redis Cache

  |

Database
```

---

# Database Caching

Frequently accessed queries are cached.

Example:

```sql
SELECT * FROM products WHERE id=1;
```

Instead of hitting database repeatedly:

```text
Result Stored In Cache
```

---

# In-Memory Caching

Data stored in RAM.

Examples:

```text
Redis

Memcached
```

Benefits:

```text
Microsecond Access

Extremely Fast
```

---

# Distributed Caching

Single cache server becomes bottleneck.

Solution:

```text
Multiple Cache Nodes
```

Architecture:

```text
Application

     |

+----+----+----+

|         |    |

Redis1 Redis2 Redis3
```

Enables horizontal scaling.

---

# Redis

Most popular caching system.

Stores:

```text
Key → Value
```

Example:

```text
user:101 → User Object
```

Advantages:

```text
Extremely Fast

In-Memory

Replication

Persistence Support
```

---

## Redis Example

```javascript
import Redis from "ioredis";

const redis = new Redis();

await redis.set("name", "Nitin");

const value = await redis.get("name");

console.log(value);
```

Output:

```text
Nitin
```

---

# Memcached

Another popular cache.

Characteristics:

```text
Simple

Fast

Distributed

Memory Only
```

Compared to Redis:

```text
Less Features

Higher Simplicity
```

---

# Cache Eviction Policies

Cache memory is limited.

When full:

```text
Old Data Must Be Removed
```

This process is called:

```text
Eviction
```

---

## LRU (Least Recently Used)

Removes least recently accessed item.

```text
Cache:

A B C D

Access:

A C D

Remove:

B
```

Most commonly used.

---

## LFU (Least Frequently Used)

Removes least used item.

```text
A -> 100 Hits

B -> 5 Hits

C -> 1 Hit

Remove C
```

---

## FIFO (First In First Out)

```text
First Inserted

First Removed
```

Queue-based approach.

---

# Cache Invalidation

One of the hardest problems in system design.

Problem:

```text
Database Updated

Cache Still Old
```

Users see stale data.

---

## Example

```text
Database Price = ₹500

Cache Price = ₹450
```

Incorrect response.

Need cache update.

---

# Write Strategies

---

## Cache Aside Pattern

Most common pattern.

```text
Read:

Cache

  |

Miss

  |

Database

  |

Store In Cache
```

---

### JavaScript Example

```javascript
async function getUser(id) {
  let user = await redis.get(id);

  if (user) {
    return JSON.parse(user);
  }

  user = await db.user.findUnique({
    where: { id }
  });

  await redis.set(
    id,
    JSON.stringify(user)
  );

  return user;
}
```

---

## Write Through

```text
Application

   |

Cache

   |

Database
```

Both updated together.

---

## Write Back

```text
Application

   |

Cache

   |

Later

   |

Database
```

Higher performance.

Risk of data loss.

---

## Write Around

```text
Writes -> Database

Reads -> Cache
```

Avoids cache pollution.

---

# Cache Consistency Challenges

Problems:

```text
Stale Data

Race Conditions

Network Delays

Replication Lag
```

---

# Cache Stampede

Many requests arrive after cache expiration.

Example:

```text
10,000 Requests

      |

Cache Expired

      |

10,000 Database Queries
```

Database overload occurs.

---

## Solution

```text
Mutex Lock

Background Refresh

Random Expiration
```

---

# Cache Penetration

Requests for non-existing data.

Example:

```text
User ID = 999999999

Not In Cache

Not In Database
```

Every request hits database.

---

## Solution

```text
Bloom Filter

Null Value Caching
```

---

# Cache Breakdown

Hot key expires.

Example:

```text
Trending Product

Millions Of Requests

Key Expires

Database Overloaded
```

---

## Solution

```text
Never Expire Hot Keys

Background Refresh
```

---

# Real-World Examples

## Netflix

Uses caching for:

```text
Movies

Recommendations

User Profiles
```

---

## Amazon

Caches:

```text
Product Data

Inventory

Pricing
```

---

## Facebook

Caches:

```text
News Feed

User Sessions

Friend Lists
```

---

## Instagram

Uses Redis for:

```text
Feeds

Stories

User Metadata
```

---

# Caching Design Patterns

```text
Cache Aside

Write Through

Write Back

Write Around
```

---

# Interview Questions

### What is caching?

Caching stores frequently accessed data in a faster storage layer.

---

### What is a cache hit?

Data found directly in cache.

---

### What is a cache miss?

Data not found in cache and must be fetched from source.

---

### Why is Redis popular?

```text
In-Memory

Fast

Distributed

Highly Scalable
```

---

### Difference between Redis and Memcached?

| Redis                | Memcached        |
| -------------------- | ---------------- |
| Rich Data Structures | Simple Key-Value |
| Persistence          | No Persistence   |
| Replication          | Limited          |
| More Features        | Lightweight      |

---

### What is Cache Aside Pattern?

Application checks cache first, then database on miss.

---

### What is Cache Stampede?

Large number of requests hitting database after cache expiry.

---

### What is Cache Invalidation?

Updating/removing stale cache data when source data changes.

---

# Summary

* Caching improves application performance.
* Cache stores frequently accessed data.
* Cache hits are fast; cache misses access database.
* Redis is the most widely used cache.
* Cache eviction policies include LRU, LFU, and FIFO.
* Cache Aside is the most common caching strategy.
* Cache invalidation is a major challenge.
* Distributed caching enables internet-scale applications.
* Netflix, Amazon, Facebook, and Instagram heavily rely on caching.
* Good caching can reduce latency from seconds to milliseconds.

---

# Next Chapter

## Day 05 - Database Indexing and Query Optimization

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
