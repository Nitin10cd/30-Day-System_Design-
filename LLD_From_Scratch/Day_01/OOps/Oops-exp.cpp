#include <iostream>
#include <string>

using namespace std;

/*
    Base class representing a generic employee.

    This class demonstrates:
    - Encapsulation
    - Abstraction
*/
class Employee
{
private:
    int salary;

protected:
    string name;
    int employeeId;

public:
    Employee(string name, int employeeId, int salary)
        : name(name), employeeId(employeeId)
    {
        setSalary(salary);
    }

    void setSalary(int amount)
    {
        if (amount > 0)
        {
            salary = amount;
        }
    }

    int getSalary() const
    {
        return salary;
    }

    virtual void performWork() = 0;

    virtual ~Employee() = default;
};

/*
    Software engineer implementation.
*/
class SoftwareEngineer : public Employee
{
public:
    SoftwareEngineer(
        string name,
        int employeeId,
        int salary)
        : Employee(name, employeeId, salary)
    {
    }

    void performWork() override
    {
        cout << name
             << " is developing software features."
             << endl;
    }
};

/*
    Manager implementation.
*/
class Manager : public Employee
{
public:
    Manager(
        string name,
        int employeeId,
        int salary)
        : Employee(name, employeeId, salary)
    {
    }

    void performWork() override
    {
        cout << name
             << " is managing project execution."
             << endl;
    }
};

/*
    Designer implementation.
*/
class Designer : public Employee
{
public:
    Designer(
        string name,
        int employeeId,
        int salary)
        : Employee(name, employeeId, salary)
    {
    }

    void performWork() override
    {
        cout << name
             << " is designing product interfaces."
             << endl;
    }
};

int main()
{
    Employee* employees[] =
    {
        new SoftwareEngineer(
            "Alice",
            101,
            120000),

        new Manager(
            "Bob",
            102,
            150000),

        new Designer(
            "Charlie",
            103,
            100000)
    };

    for (Employee* employee : employees)
    {
        employee->performWork();

        cout << "Salary: "
             << employee->getSalary()
             << endl;

        cout << endl;
    }

    for (Employee* employee : employees)
    {
        delete employee;
    }

    return 0;
}