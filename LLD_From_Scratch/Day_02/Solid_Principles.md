Here's a detailed README-style document for **SOLID Principles in Low-Level Design (LLD)** that you can directly use in your repository.

# SOLID Principles in Low-Level Design (LLD)

## Table of Contents

1. Introduction
2. Why SOLID Principles Matter
3. What is Low-Level Design (LLD)?
4. Overview of SOLID Principles
5. Single Responsibility Principle (SRP)
6. Open Closed Principle (OCP)
7. Liskov Substitution Principle (LSP)
8. Interface Segregation Principle (ISP)
9. Dependency Inversion Principle (DIP)
10. SOLID vs Bad Design
11. Real-World Applications
12. Benefits of SOLID
13. Common Mistakes
14. Interview Questions
15. Conclusion

---

# Introduction

SOLID is a collection of five object-oriented design principles introduced by **Robert C. Martin (Uncle Bob)**.

These principles help developers create:

* Maintainable code
* Scalable systems
* Flexible architectures
* Testable applications
* Reusable components

Without SOLID, software often becomes difficult to modify, extend, debug, and maintain.

---

# Why SOLID Principles Matter

As applications grow:

* New features are added
* Existing functionality changes
* Teams become larger
* Codebases become complex

Poor design leads to:

```text
Spaghetti Code
↓
Hard to Understand
↓
Hard to Maintain
↓
More Bugs
↓
Slow Development
```

SOLID principles solve these problems by promoting clean and modular design.

---

# What is Low-Level Design (LLD)?

Low-Level Design focuses on:

* Classes
* Objects
* Methods
* Interfaces
* Relationships between classes

Example:

```text
System Design
│
├── High Level Design (HLD)
│     ├── Architecture
│     ├── Services
│     └── Databases
│
└── Low Level Design (LLD)
      ├── Classes
      ├── Objects
      ├── Interfaces
      └── Design Patterns
```

SOLID principles are primarily used in LLD.

---

# Overview of SOLID Principles

| Principle | Full Form                       |
| --------- | ------------------------------- |
| S         | Single Responsibility Principle |
| O         | Open Closed Principle           |
| L         | Liskov Substitution Principle   |
| I         | Interface Segregation Principle |
| D         | Dependency Inversion Principle  |

---

# 1. Single Responsibility Principle (SRP)

## Definition

> A class should have only one reason to change.

A class should perform only one job.

---

## Bad Example

```java
class UserService {

    public void saveUser() {
        // save user
    }

    public void sendEmail() {
        // send email
    }

    public void generateReport() {
        // generate report
    }
}
```

Problems:

* User management
* Email handling
* Report generation

Three responsibilities in one class.

---

## Good Example

### User Service

```java
class UserService {
    public void saveUser() {
    }
}
```

### Email Service

```java
class EmailService {
    public void sendEmail() {
    }
}
```

### Report Service

```java
class ReportService {
    public void generateReport() {
    }
}
```

Now each class has a single responsibility.

---

## Real World Example

### Bad

A teacher:

* Teaches students
* Manages payroll
* Repairs computers

### Good

Separate roles:

* Teacher
* Accountant
* Technician

Each has one responsibility.

---

# 2. Open Closed Principle (OCP)

## Definition

> Software entities should be open for extension but closed for modification.

You should be able to add new functionality without changing existing code.

---

## Bad Example

```java
class DiscountCalculator {

    public double calculate(String customerType) {

        if(customerType.equals("REGULAR"))
            return 10;

        if(customerType.equals("PREMIUM"))
            return 20;

        return 0;
    }
}
```

Problem:

Every new customer type requires modifying the class.

---

## Good Example

### Discount Interface

```java
interface Discount {
    double calculate();
}
```

### Regular Discount

```java
class RegularDiscount implements Discount {

    public double calculate() {
        return 10;
    }
}
```

### Premium Discount

```java
class PremiumDiscount implements Discount {

    public double calculate() {
        return 20;
    }
}
```

### Calculator

```java
class DiscountCalculator {

    public double calculate(Discount discount) {
        return discount.calculate();
    }
}
```

Now adding a new discount does not require modifying existing code.

---

## Real World Example

Mobile charger socket.

You can plug different chargers into the same socket without modifying the socket.

---

# 3. Liskov Substitution Principle (LSP)

## Definition

> Subtypes should be replaceable with their base types without altering program correctness.

A child class should behave like its parent.

---

## Bad Example

### Bird

```java
class Bird {
    void fly() {}
}
```

### Penguin

```java
class Penguin extends Bird {

    @Override
    void fly() {
        throw new RuntimeException();
    }
}
```

Problem:

Penguins cannot fly.

---

## Good Example

### Bird

```java
class Bird {
}
```

### FlyingBird

```java
class FlyingBird extends Bird {
    void fly() {}
}
```

### Sparrow

```java
class Sparrow extends FlyingBird {
}
```

### Penguin

```java
class Penguin extends Bird {
}
```

Now hierarchy makes sense.

---

## Real World Example

Imagine:

```text
Vehicle
 ├── Car
 ├── Bike
 └── Boat
```

If Vehicle defines:

```java
startEngine()
```

then every subclass should support it.

If one cannot, inheritance is wrong.

---

# 4. Interface Segregation Principle (ISP)

## Definition

> Clients should not be forced to depend on interfaces they do not use.

Large interfaces should be split into smaller interfaces.

---

## Bad Example

```java
interface Worker {

    void work();

    void eat();

    void sleep();
}
```

Robot implementation:

```java
class Robot implements Worker {

    public void work() {}

    public void eat() {
        throw new UnsupportedOperationException();
    }

    public void sleep() {
        throw new UnsupportedOperationException();
    }
}
```

Problem:

Robot doesn't need eat or sleep.

---

## Good Example

### Workable

```java
interface Workable {
    void work();
}
```

### Eatable

```java
interface Eatable {
    void eat();
}
```

### Sleepable

```java
interface Sleepable {
    void sleep();
}
```

### Human

```java
class Human
implements Workable,
           Eatable,
           Sleepable {
}
```

### Robot

```java
class Robot
implements Workable {
}
```

Perfect segregation.

---

## Real World Example

Bad:

```text
Super Remote Control
 ├── TV Buttons
 ├── AC Buttons
 ├── Washing Machine Buttons
 └── Microwave Buttons
```

Good:

Separate remotes for separate devices.

---

# 5. Dependency Inversion Principle (DIP)

## Definition

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

---

## Bad Example

```java
class MySQLDatabase {

    public void save() {
    }
}
```

```java
class UserService {

    private MySQLDatabase db =
            new MySQLDatabase();

    public void saveUser() {
        db.save();
    }
}
```

Problem:

UserService is tightly coupled with MySQL.

Switching to PostgreSQL requires code changes.

---

## Good Example

### Database Interface

```java
interface Database {

    void save();
}
```

### MySQL

```java
class MySQLDatabase
implements Database {

    public void save() {
    }
}
```

### PostgreSQL

```java
class PostgreSQLDatabase
implements Database {

    public void save() {
    }
}
```

### UserService

```java
class UserService {

    private Database db;

    UserService(Database db) {
        this.db = db;
    }

    public void saveUser() {
        db.save();
    }
}
```

Usage:

```java
Database db = new MySQLDatabase();

UserService service =
        new UserService(db);
```

Now implementation can change without affecting business logic.

---

## Real World Example

You use:

```text
Keyboard
↓
USB Port
↓
Computer
```

Computer depends on USB standard, not a specific keyboard.

---

# SOLID vs Bad Design

| Bad Design            | SOLID Design     |
| --------------------- | ---------------- |
| Tight Coupling        | Loose Coupling   |
| Hard to Test          | Easy to Test     |
| Difficult Maintenance | Easy Maintenance |
| Frequent Bugs         | Stable Code      |
| Poor Reusability      | High Reusability |
| Difficult Extension   | Easy Extension   |

---

# Real-World Applications

## Spring Boot

Uses:

* Dependency Injection
* Interfaces
* Service Layers

Strongly follows:

* OCP
* DIP
* ISP

---

## React

Component architecture promotes:

* SRP
* OCP

Each component handles one responsibility.

---

## Microservices

SOLID principles help create:

* Independent services
* Easy deployment
* Better maintainability

---

# Benefits of SOLID Principles

### Better Readability

Code becomes easier to understand.

### Easier Maintenance

Changes affect fewer modules.

### Scalability

New features can be added easily.

### Reusability

Components can be reused.

### Testability

Unit testing becomes simpler.

### Flexibility

System adapts to change quickly.

---

# Common Mistakes

## Overusing Inheritance

Bad:

```java
Animal
  ↓
Bird
  ↓
Penguin
```

When Penguin cannot fly.

Prefer composition when appropriate.

---

## Huge Interfaces

Bad:

```java
interface Everything {
}
```

Follow ISP.

---

## Direct Dependencies

Bad:

```java
new MySQLDatabase()
```

inside business logic.

Follow DIP.

---

## God Classes

One class doing everything.

Violates SRP.

---

# Interview Questions

### What does SOLID stand for?

* Single Responsibility Principle
* Open Closed Principle
* Liskov Substitution Principle
* Interface Segregation Principle
* Dependency Inversion Principle

---

### Which principle improves extensibility?

Open Closed Principle (OCP)

---

### Which principle helps reduce coupling?

Dependency Inversion Principle (DIP)

---

### Which principle prevents giant interfaces?

Interface Segregation Principle (ISP)

---

### Which principle ensures subclasses behave correctly?

Liskov Substitution Principle (LSP)

---

### Which principle says one class should have one job?

Single Responsibility Principle (SRP)

---

# Conclusion

SOLID principles are the foundation of clean object-oriented design and are heavily used in Low-Level Design interviews and real-world software development.

By following SOLID principles, developers can build systems that are:

* Clean
* Flexible
* Scalable
* Maintainable
* Testable

A simple rule to remember:

```text
S → One Class = One Responsibility

O → Extend, Don't Modify

L → Child Should Behave Like Parent

I → Small Focused Interfaces

D → Depend on Abstractions, Not Implementations
```

Mastering SOLID is one of the most important steps toward becoming a strong software engineer and excelling in LLD interviews.
