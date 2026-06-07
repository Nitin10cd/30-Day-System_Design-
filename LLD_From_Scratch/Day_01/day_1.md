# Day 01 - Object Oriented Programming (OOP)

## Introduction

Object-Oriented Programming (OOP) is a programming paradigm that organizes software around objects rather than functions and logic.

An object represents a real-world entity that contains:

- State (Data)
- Behavior (Functions)

OOP helps developers build software that is:

- Reusable
- Maintainable
- Scalable
- Modular
- Easy to Extend

Almost every modern Low-Level Design concept, including SOLID Principles, Design Patterns, and System Modeling, is built on top of OOP fundamentals.

---

# Why OOP?

Imagine building a School Management System.

Without OOP:

```cpp
string studentName;
int studentAge;
float studentMarks;
```

As the application grows:

- Data becomes difficult to manage
- Logic gets scattered
- Code duplication increases
- Maintenance becomes difficult

OOP solves these problems by grouping related data and behavior together.

---

# Four Pillars of OOP

1. Encapsulation
2. Abstraction
3. Inheritance
4. Polymorphism

These four concepts form the foundation of object-oriented design.

---

# Example Used Throughout This Chapter

We will use a simple Employee Management System.

Every employee:

- Has a name
- Has an employee ID
- Can perform work

Different employees:

- Software Engineers
- Managers
- Designers

share common properties while having different behaviors.

---

# 1. Encapsulation

## Definition

Encapsulation is the process of bundling data and methods together inside a class while restricting direct access to internal data.

Simply put:

> Hide data and expose only what is necessary.

---

## Why Do We Need It?

Without encapsulation:

```cpp
employee.salary = -10000;
```

Anyone can modify data incorrectly.

Encapsulation protects the object from invalid states.

---

## Benefits

- Data protection
- Better maintainability
- Controlled access
- Reduced bugs

---

## Example

```cpp
class Employee
{
private:
    int salary;

public:
    void setSalary(int amount)
    {
        if (amount > 0)
        {
            salary = amount;
        }
    }

    int getSalary()
    {
        return salary;
    }
};
```

---

# 2. Abstraction

## Definition

Abstraction means hiding implementation details and exposing only essential functionality.

Users should know:

"What a system does"

not

"How it does it"

---

## Real World Example

When driving a car:

You use:

- Steering
- Accelerator
- Brake

You do not need to know:

- Engine combustion
- Fuel injection
- Gear synchronization

Those details are hidden.

---

## Benefits

- Reduced complexity
- Cleaner interfaces
- Easier maintenance
- Better flexibility

---

## Example

```cpp
class Employee
{
public:
    virtual void performWork() = 0;
};
```

Users only know:

```cpp
employee->performWork();
```

The internal implementation remains hidden.

---

# 3. Inheritance

## Definition

Inheritance allows one class to acquire properties and behaviors from another class.

It represents an "is-a" relationship.

---

## Real World Example

```text
Employee
│
├── SoftwareEngineer
│
├── Manager
│
└── Designer
```

Every Software Engineer is an Employee.

Every Manager is an Employee.

Every Designer is an Employee.

---

## Benefits

- Code reuse
- Better organization
- Easier maintenance
- Extensibility

---

## Example

```cpp
class Employee
{
protected:
    string name;
    int employeeId;
};
```

Derived class:

```cpp
class SoftwareEngineer : public Employee
{
};
```

SoftwareEngineer automatically inherits Employee properties.

---

# 4. Polymorphism

## Definition

Polymorphism means:

> One interface, multiple implementations.

The same function call can behave differently depending on the object.

---

## Real World Example

```cpp
employee->performWork();
```

For a Software Engineer:

```text
Writing code...
```

For a Manager:

```text
Managing team...
```

For a Designer:

```text
Designing UI...
```

Same method.

Different behavior.

---

## Benefits

- Flexibility
- Extensibility
- Cleaner code
- Reduced conditionals

---

# Compile-Time Polymorphism

Achieved using:

- Function Overloading
- Operator Overloading

Example:

```cpp
int add(int a, int b);

double add(double a, double b);
```

Compiler decides which function to call.

---

# Run-Time Polymorphism

Achieved using:

- Virtual Functions
- Method Overriding

Example:

```cpp
employee->performWork();
```

Actual method is determined at runtime.

---

# OOP Relationship Diagram

```text
                 Employee
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼

SoftwareEngineer   Manager      Designer

       │             │             │
       └─────────────┼─────────────┘
                     │
             performWork()
                     │
     Different implementations
```

---

# Why OOP Matters in LLD

Every major Low-Level Design concept depends on OOP.

Examples:

### Design Patterns

- Singleton
- Factory
- Builder
- Strategy
- Observer

All rely heavily on OOP principles.

---

### SOLID Principles

Every SOLID principle assumes:

- Classes
- Interfaces
- Encapsulation
- Polymorphism

---

### Real Systems

Applications like:

- Uber
- Netflix
- Amazon
- LinkedIn

are modeled using object-oriented concepts before implementation.

---

# Key Takeaways

1. OOP organizes software around objects.

2. Encapsulation protects data.

3. Abstraction hides complexity.

4. Inheritance enables reuse.

5. Polymorphism enables flexibility.

6. Together these four concepts form the foundation of Low-Level Design.

7. Every advanced LLD topic builds on these concepts.

---

# Next Chapter

Day 02 - Class Relationships

- Association
- Aggregation
- Composition
- Dependency

These relationships form the building blocks of object modeling in real-world systems.