/**
 * ============================================================
 * SOLID PRINCIPLES — ISP & DIP — Complete C++ Example
 * ============================================================
 *
 * I — Interface Segregation Principle (ISP)
 *     "Clients should not be forced to depend on interfaces
 *      they do not use."
 *
 * D — Dependency Inversion Principle (DIP)
 *     "High-level modules should not depend on low-level modules.
 *      Both should depend on abstractions."
 *
 * Scenario: A smart home system controlling devices.
 *
 * ─── ISP Demo ────────────────────────────────────────────────
 * We split a fat IDevice interface into focused role interfaces:
 *   IPowerable, IDimmable, ITemperatureControllable, ILockable
 *
 * ─── DIP Demo ────────────────────────────────────────────────
 * HomeAutomationController (high-level) depends only on
 * abstractions, not on SmartBulb, Thermostat, SmartLock (details).
 * Concrete classes are injected at runtime (Dependency Injection).
 *
 * ============================================================
 */

#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <stdexcept>

// ============================================================
// PART 1 — BEFORE ISP: FAT INTERFACE (Bad Practice)
// ============================================================

namespace Before_ISP {

    // ❌ FAT interface — forces all classes to implement everything
    class IDevice {
    public:
        virtual void turnOn() = 0;
        virtual void turnOff() = 0;
        virtual void setBrightness(int level) = 0;   // Not all devices have brightness!
        virtual void setTemperature(int temp) = 0;   // Not all devices control temp!
        virtual void lock() = 0;                     // Not all devices can lock!
        virtual void unlock() = 0;
        virtual ~IDevice() = default;
    };

    // ❌ SmartBulb is FORCED to implement lock/unlock and temperature
    class SmartBulb : public IDevice {
    public:
        void turnOn() override  { std::cout << "[Bulb] Turned ON\n"; }
        void turnOff() override { std::cout << "[Bulb] Turned OFF\n"; }
        void setBrightness(int level) override { std::cout << "[Bulb] Brightness: " << level << "%\n"; }

        // ❌ Forced garbage implementations — ISP violation!
        void setTemperature(int) override { throw std::runtime_error("[Bulb] Cannot control temperature!"); }
        void lock() override             { throw std::runtime_error("[Bulb] Cannot lock!"); }
        void unlock() override           { throw std::runtime_error("[Bulb] Cannot unlock!"); }
    };

    void demonstrate() {
        std::cout << "\n=== BEFORE ISP (Fat Interface — BAD) ===\n";
        SmartBulb bulb;
        bulb.turnOn();
        bulb.setBrightness(75);
        try {
            bulb.lock(); // Runtime crash — client doesn't know this will fail!
        } catch (const std::exception& e) {
            std::cout << "Runtime Error: " << e.what() << "\n";
        }
    }

} // namespace Before_ISP


// ============================================================
// PART 2 — AFTER ISP: SEGREGATED INTERFACES (Good Practice)
// ============================================================

namespace After_ISP {

    // ✅ Small, focused role interfaces — each for one specific capability

    class IPowerable {
    public:
        virtual void turnOn() = 0;
        virtual void turnOff() = 0;
        virtual bool isOn() const = 0;
        virtual ~IPowerable() = default;
    };

    class IDimmable {
    public:
        virtual void setBrightness(int level) = 0;   // 0–100
        virtual int getBrightness() const = 0;
        virtual ~IDimmable() = default;
    };

    class ITemperatureControllable {
    public:
        virtual void setTemperature(int celsius) = 0;
        virtual int getTemperature() const = 0;
        virtual ~ITemperatureControllable() = default;
    };

    class ILockable {
    public:
        virtual void lock() = 0;
        virtual void unlock() = 0;
        virtual bool isLocked() const = 0;
        virtual ~ILockable() = default;
    };

} // namespace After_ISP


// ============================================================
// PART 3 — CONCRETE DEVICES (Implementing Only What They Can)
// ============================================================

// ✅ SmartBulb: can be powered and dimmed — that's it
class SmartBulb : public After_ISP::IPowerable, public After_ISP::IDimmable {
private:
    bool powered = false;
    int brightness = 100;
    std::string name;

public:
    explicit SmartBulb(const std::string& name) : name(name) {}

    // IPowerable
    void turnOn() override  { powered = true;  std::cout << "[" << name << "] ON\n"; }
    void turnOff() override { powered = false; std::cout << "[" << name << "] OFF\n"; }
    bool isOn() const override { return powered; }

    // IDimmable
    void setBrightness(int level) override {
        brightness = std::max(0, std::min(100, level));
        std::cout << "[" << name << "] Brightness → " << brightness << "%\n";
    }
    int getBrightness() const override { return brightness; }
};


// ✅ Thermostat: can be powered and controls temperature — no dimming, no locking
class Thermostat : public After_ISP::IPowerable, public After_ISP::ITemperatureControllable {
private:
    bool powered = false;
    int temperature = 22;
    std::string name;

public:
    explicit Thermostat(const std::string& name) : name(name) {}

    // IPowerable
    void turnOn() override  { powered = true;  std::cout << "[" << name << "] ON\n"; }
    void turnOff() override { powered = false; std::cout << "[" << name << "] OFF\n"; }
    bool isOn() const override { return powered; }

    // ITemperatureControllable
    void setTemperature(int celsius) override {
        temperature = celsius;
        std::cout << "[" << name << "] Temperature → " << temperature << "°C\n";
    }
    int getTemperature() const override { return temperature; }
};


// ✅ SmartLock: can be powered and locked — no temperature, no dimming
class SmartLock : public After_ISP::IPowerable, public After_ISP::ILockable {
private:
    bool powered = false;
    bool locked = true;
    std::string name;

public:
    explicit SmartLock(const std::string& name) : name(name) {}

    // IPowerable
    void turnOn() override  { powered = true;  std::cout << "[" << name << "] Armed\n"; }
    void turnOff() override { powered = false; std::cout << "[" << name << "] Disarmed\n"; }
    bool isOn() const override { return powered; }

    // ILockable
    void lock() override   { locked = true;  std::cout << "[" << name << "] LOCKED 🔒\n"; }
    void unlock() override { locked = false; std::cout << "[" << name << "] UNLOCKED 🔓\n"; }
    bool isLocked() const override { return locked; }
};


// ✅ AllInOneDevice: smart panel — does everything
class SmartPanel : public After_ISP::IPowerable,
                   public After_ISP::IDimmable,
                   public After_ISP::ITemperatureControllable,
                   public After_ISP::ILockable {
private:
    bool powered = false;
    int brightness = 50;
    int temperature = 20;
    bool locked = false;
    std::string name;

public:
    explicit SmartPanel(const std::string& name) : name(name) {}

    void turnOn() override  { powered = true;  std::cout << "[" << name << "] Panel ON\n"; }
    void turnOff() override { powered = false; std::cout << "[" << name << "] Panel OFF\n"; }
    bool isOn() const override { return powered; }

    void setBrightness(int level) override { brightness = level; std::cout << "[" << name << "] Brightness → " << level << "%\n"; }
    int getBrightness() const override { return brightness; }

    void setTemperature(int celsius) override { temperature = celsius; std::cout << "[" << name << "] Temp → " << celsius << "°C\n"; }
    int getTemperature() const override { return temperature; }

    void lock() override   { locked = true;  std::cout << "[" << name << "] Panel LOCKED\n"; }
    void unlock() override { locked = false; std::cout << "[" << name << "] Panel UNLOCKED\n"; }
    bool isLocked() const override { return locked; }
};


// ============================================================
// PART 4 — DIP: HIGH-LEVEL CONTROLLER DEPENDS ON ABSTRACTIONS
// ============================================================

/**
 * HomeAutomationController is the HIGH-LEVEL module.
 *
 * It knows nothing about SmartBulb, Thermostat, SmartLock.
 * It only knows about: IPowerable, IDimmable, ITemperatureControllable, ILockable.
 *
 * Concrete devices are INJECTED via constructor (Constructor Injection pattern).
 */
class HomeAutomationController {
private:
    // ✅ Dependencies on ABSTRACTIONS, not concrete classes
    std::vector<After_ISP::IPowerable*> powerableDevices;
    std::vector<After_ISP::IDimmable*> dimmableDevices;
    std::vector<After_ISP::ITemperatureControllable*> climateDevices;
    std::vector<After_ISP::ILockable*> lockableDevices;

public:
    // ✅ Devices injected from outside — DIP via Constructor Injection
    void registerPowerableDevice(After_ISP::IPowerable* device) {
        powerableDevices.push_back(device);
    }

    void registerDimmableDevice(After_ISP::IDimmable* device) {
        dimmableDevices.push_back(device);
    }

    void registerClimateDevice(After_ISP::ITemperatureControllable* device) {
        climateDevices.push_back(device);
    }

    void registerLockableDevice(After_ISP::ILockable* device) {
        lockableDevices.push_back(device);
    }

    // High-level business operations — using only abstractions
    void activateAllDevices() {
        std::cout << "\n--- Activating all devices ---\n";
        for (auto* device : powerableDevices) {
            device->turnOn();
        }
    }

    void deactivateAllDevices() {
        std::cout << "\n--- Deactivating all devices ---\n";
        for (auto* device : powerableDevices) {
            device->turnOff();
        }
    }

    void setEveningAmbience() {
        std::cout << "\n--- Setting evening ambience ---\n";
        for (auto* device : dimmableDevices) {
            device->setBrightness(30);  // Dim lights to 30%
        }
        for (auto* device : climateDevices) {
            device->setTemperature(21); // Comfortable evening temp
        }
    }

    void setMorningMode() {
        std::cout << "\n--- Setting morning mode ---\n";
        for (auto* device : dimmableDevices) {
            device->setBrightness(100); // Full brightness
        }
        for (auto* device : climateDevices) {
            device->setTemperature(23); // Slightly warmer
        }
    }

    void secureHome() {
        std::cout << "\n--- Securing home ---\n";
        for (auto* device : lockableDevices) {
            device->lock();
        }
    }

    void openHome() {
        std::cout << "\n--- Opening home ---\n";
        for (auto* device : lockableDevices) {
            device->unlock();
        }
    }

    void printStatus() const {
        std::cout << "\n--- Status Report ---\n";
        std::cout << "Powerable devices: " << powerableDevices.size() << "\n";
        std::cout << "Dimmable devices:  " << dimmableDevices.size() << "\n";
        std::cout << "Climate devices:   " << climateDevices.size() << "\n";
        std::cout << "Lockable devices:  " << lockableDevices.size() << "\n";
    }
};


// ============================================================
// PART 5 — MOCK CLASSES FOR TESTING (DIP BENEFIT)
// ============================================================

/**
 * Because HomeAutomationController depends only on abstractions,
 * we can inject mock objects for testing — no real hardware needed!
 */

class MockPowerableDevice : public After_ISP::IPowerable {
public:
    int turnOnCount = 0;
    int turnOffCount = 0;
    bool state = false;

    void turnOn() override  { turnOnCount++;  state = true; }
    void turnOff() override { turnOffCount++; state = false; }
    bool isOn() const override { return state; }
};

class MockDimmableDevice : public After_ISP::IDimmable {
public:
    int lastBrightness = -1;

    void setBrightness(int level) override { lastBrightness = level; }
    int getBrightness() const override { return lastBrightness; }
};

class MockLockableDevice : public After_ISP::ILockable {
public:
    bool lockedState = false;

    void lock() override   { lockedState = true; }
    void unlock() override { lockedState = false; }
    bool isLocked() const override { return lockedState; }
};

void runTests() {
    std::cout << "\n=== UNIT TESTS (DIP Enables Mock Injection) ===\n";

    MockPowerableDevice mockPower;
    MockDimmableDevice mockDim;
    MockLockableDevice mockLock;

    HomeAutomationController controller;
    controller.registerPowerableDevice(&mockPower);
    controller.registerDimmableDevice(&mockDim);
    controller.registerLockableDevice(&mockLock);

    // Test activateAllDevices
    controller.activateAllDevices();
    if (mockPower.turnOnCount == 1 && mockPower.state == true)
        std::cout << "✅ Test PASSED: activateAllDevices works correctly\n";
    else
        std::cout << "❌ Test FAILED: activateAllDevices\n";

    // Test setEveningAmbience
    controller.setEveningAmbience();
    if (mockDim.lastBrightness == 30)
        std::cout << "✅ Test PASSED: setEveningAmbience dims correctly\n";
    else
        std::cout << "❌ Test FAILED: setEveningAmbience brightness\n";

    // Test secureHome
    controller.secureHome();
    if (mockLock.lockedState == true)
        std::cout << "✅ Test PASSED: secureHome locks all lockable devices\n";
    else
        std::cout << "❌ Test FAILED: secureHome\n";

    // Test deactivateAllDevices
    controller.deactivateAllDevices();
    if (mockPower.state == false && mockPower.turnOffCount == 1)
        std::cout << "✅ Test PASSED: deactivateAllDevices works correctly\n";
    else
        std::cout << "❌ Test FAILED: deactivateAllDevices\n";
}


// ============================================================
// MAIN — COMPOSITION ROOT (Where Concrete Types Are Wired Up)
// ============================================================

int main() {
    std::cout << "========================================\n";
    std::cout << " SOLID ISP & DIP — Smart Home Demo\n";
    std::cout << "========================================\n";

    // ── Step 1: Show the ISP violation ──────────────────────
    Before_ISP::demonstrate();

    // ── Step 2: ISP + DIP in action ─────────────────────────
    std::cout << "\n=== AFTER ISP + DIP (Good Practice) ===\n";

    // COMPOSITION ROOT: The ONLY place that knows about concrete types
    SmartBulb livingRoomLight("Living Room Light");
    SmartBulb bedroomLight("Bedroom Light");
    Thermostat mainThermostat("Main Thermostat");
    SmartLock frontDoor("Front Door Lock");
    SmartLock backDoor("Back Door Lock");
    SmartPanel controlPanel("Central Panel"); // Implements all interfaces

    // HIGH-LEVEL CONTROLLER — depends only on abstractions (DIP)
    HomeAutomationController controller;

    // Register devices by their role/capability (ISP)
    // Each device is registered only for what it CAN do
    controller.registerPowerableDevice(&livingRoomLight);
    controller.registerPowerableDevice(&bedroomLight);
    controller.registerPowerableDevice(&mainThermostat);
    controller.registerPowerableDevice(&frontDoor);
    controller.registerPowerableDevice(&backDoor);
    controller.registerPowerableDevice(&controlPanel);

    controller.registerDimmableDevice(&livingRoomLight);
    controller.registerDimmableDevice(&bedroomLight);
    controller.registerDimmableDevice(&controlPanel);    // SmartPanel is also dimmable

    controller.registerClimateDevice(&mainThermostat);
    controller.registerClimateDevice(&controlPanel);    // SmartPanel controls temp too

    controller.registerLockableDevice(&frontDoor);
    controller.registerLockableDevice(&backDoor);
    controller.registerLockableDevice(&controlPanel);   // SmartPanel can lock too

    controller.printStatus();

    // ── Step 3: Use high-level operations ───────────────────
    controller.activateAllDevices();
    controller.setMorningMode();

    std::cout << "\n[... time passes ...]\n";

    controller.setEveningAmbience();
    controller.secureHome();
    controller.deactivateAllDevices();

    // ── Step 4: Open/unlock in the morning ──────────────────
    std::cout << "\n[Next morning...]\n";
    controller.openHome();
    controller.activateAllDevices();

    // ── Step 5: Unit Tests (DIP benefit — mocks!) ───────────
    runTests();

    // ── Step 6: Demonstrate easy swap (DIP benefit) ─────────
    std::cout << "\n=== DIP BENEFIT: Swap Implementation with Zero Business Logic Change ===\n";
    std::cout << "Replacing SmartBulb with a new AdvancedLEDBulb (both implement IDimmable):\n";
    std::cout << "→ HomeAutomationController requires NO code change.\n";
    std::cout << "→ Just swap the injected object in the composition root.\n";
    std::cout << "→ This is the power of DIP!\n";

    std::cout << "\n========================================\n";
    std::cout << " Demo complete.\n";
    std::cout << "========================================\n";

    return 0;
}

/*
 * ============================================================
 * COMPILATION
 * ============================================================
 *
 *   g++ -std=c++17 -Wall -Wextra -o solid_i_d solid_ISP_DIP.cpp
 *   ./solid_i_d
 *
 * ============================================================
 * KEY TAKEAWAYS
 * ============================================================
 *
 * ISP (Interface Segregation Principle):
 *   • Split IDevice into: IPowerable, IDimmable,
 *     ITemperatureControllable, ILockable
 *   • SmartBulb only implements IPowerable + IDimmable
 *   • SmartLock only implements IPowerable + ILockable
 *   • No class is forced to implement what it cannot do
 *   • No more "throw NotImplemented()" garbage
 *
 * DIP (Dependency Inversion Principle):
 *   • HomeAutomationController (HIGH-LEVEL) never mentions
 *     SmartBulb, Thermostat, or SmartLock (LOW-LEVEL)
 *   • It only uses: IPowerable, IDimmable, ITemperatureControllable,
 *     ILockable (ABSTRACTIONS)
 *   • Concrete classes injected via registerXxx() methods
 *   • MockXxx classes allow testing WITHOUT real hardware
 *   • Swapping SmartBulb → AdvancedLEDBulb = zero business logic change
 *
 * ============================================================
 */