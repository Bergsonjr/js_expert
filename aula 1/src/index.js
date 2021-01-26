const Employee = require("./employee");
const Manager = require("./manager");
const assert = require("assert");
const Util = require("./util");

const GENDER = {
  male: "male",
  female: "female",
};

{
  const employee = new Employee({
    name: "Berguin",
    gender: GENDER.male,
    age: 21,
  });

  assert.deepStrictEqual(employee.name, "Mr. Berguin");
  assert.deepStrictEqual(employee.age, undefined);
  assert.deepStrictEqual(employee.gender, undefined);
  assert.deepStrictEqual(employee.grossPay, Util.formatCurrency(5000.4));
  assert.deepStrictEqual(employee.netPay, Util.formatCurrency(4000.32));

  console.log("\n---- Employee ----");
  console.log("employee.name", employee.name);
  console.log("employee.gender", employee.gender);
  console.log("employee.age", employee.age);
  console.log("employee.birthYear", employee.birthYear);
  console.log("employee.grossPay", employee.grossPay);
  console.log("employee.netPay", employee.netPay);
}

{
  const manager = new Manager({
    name: "Juninho",
    age: 18,
    gender: GENDER.male,
  });

  assert.deepStrictEqual(manager.name, "Mr. Juninho");
  assert.deepStrictEqual(manager.gender, undefined);
  assert.deepStrictEqual(manager.age, undefined);
  assert.deepStrictEqual(manager.birthYear, 2003);
  assert.deepStrictEqual(manager.grossPay, Util.formatCurrency(5000.4));
  assert.deepStrictEqual(manager.netPay, Util.formatCurrency(6000.32));
  assert.deepStrictEqual(manager.bonuses, Util.formatCurrency(2000));

  console.log("\n---- Manager ----");
  console.log("manager.name", manager.name);
  console.log("manager.gender", manager.gender);
  console.log("manager.age", manager.age);
  console.log("manager.birthYear", manager.birthYear);
  console.log("manager.grossPay", manager.grossPay);
  console.log("manager.netPay", manager.netPay);
  console.log("manager.bonuses", manager.bonuses);
}
