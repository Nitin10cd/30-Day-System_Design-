#include <iostream>
#include <string>
#include <vector>

using namespace std;

/*
=========================================================
                OOP CONCEPTS IN C++
=========================================================

This file demonstrates all four pillars of OOP:

1. Encapsulation
2. Abstraction
3. Inheritance
4. Polymorphism

Real World Example:
Employee Management System

=========================================================
*/


/*
=========================================================
1. ABSTRACTION

Employee is an abstract representation of an employee.

Every employee must work,
but HOW they work depends on their role.

The user of this class only knows:

employee->work();

and does not care about the internal implementation.
=========================================================
*/
class Employee
{
private:

    /*
    =====================================================
    2. ENCAPSULATION

    Salary is private.

    Nobody can directly access or modify it.

    It can only be accessed through controlled methods.

    This protects the object from invalid states.
    =====================================================
    */
    double salary;

protected:
    string name;
    int employeeId;

public:

    Employee(string name, int employeeId, double salary)
        : name(name), employeeId(employeeId)
    {
        setSalary(salary);
    }

    void setSalary(double salary)
    {
        if (salary > 0)
        {
            this->salary = salary;
        }
    }

    double getSalary() const
    {
        return salary;
    }

    string getName() const
    {
        return name;
    }

    int getEmployeeId() const
    {
        return employeeId;
    }

    /*
    Pure virtual function.

    Makes Employee an abstract class.

    Every derived class MUST provide its own implementation.
    */
    virtual void work() = 0;

    virtual ~Employee() = default;
};


/*
=========================================================
3. INHERITANCE

SoftwareEngineer IS-A Employee.

It inherits common properties:

- name
- employeeId
- salary methods

without rewriting them.
=========================================================
*/
class SoftwareEngineer : public Employee
{
public:
    SoftwareEngineer(
        string name,
        int employeeId,
        double salary)
        : Employee(name, employeeId, salary)
    {
    }

    void work() override
    {
        cout << getName()
             << " is writing backend APIs and fixing bugs."
             << endl;
    }
};


/*
Manager IS-A Employee
*/
class Manager : public Employee
{
public:
    Manager(
        string name,
        int employeeId,
        double salary)
        : Employee(name, employeeId, salary)
    {
    }

    void work() override
    {
        cout << getName()
             << " is conducting meetings and managing teams."
             << endl;
    }
};


/*
Designer IS-A Employee
*/
class Designer : public Employee
{
public:
    Designer(
        string name,
        int employeeId,
        double salary)
        : Employee(name, employeeId, salary)
    {
    }

    void work() override
    {
        cout << getName()
             << " is creating product designs and prototypes."
             << endl;
    }
};



/*
=========================================================
4. POLYMORPHISM

Same interface.

Different behavior.

Employee* employee

can point to:

- SoftwareEngineer
- Manager
- Designer

Calling work() executes the correct implementation.

This is Runtime Polymorphism.
=========================================================
*/
void startWorking(Employee* employee)
{
    cout << "\nEmployee Details\n";
    cout << "------------------------\n";

    cout << "Name      : "
         << employee->getName()
         << endl;

    cout << "Salary    : "
         << employee->getSalary()
         << endl;

    cout << "Work      : ";

    employee->work();

    cout << endl;
}



/*
=========================================================
MAIN
=========================================================
*/
int main()
{
    cout << "=====================================\n";
    cout << " OOP CONCEPTS DEMONSTRATION IN C++\n";
    cout << "=====================================\n";


    vector<Employee*> employees;

    employees.push_back(
        new SoftwareEngineer(
            "Nitin",
            101,
            120000));

    employees.push_back(
        new Manager(
            "Rohit",
            102,
            150000));

    employees.push_back(
        new Designer(
            "Priya",
            103,
            100000));


    /*
    POLYMORPHISM IN ACTION
    */
    for (Employee* employee : employees)
    {
        startWorking(employee);
    }


    /*
    Memory Cleanup
    */
    for (Employee* employee : employees)
    {
        delete employee;
    }

    return 0;
}