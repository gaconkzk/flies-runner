var expect = require('chai').expect,
    runner = require('../runner'),
    fs = require('fs');

describe( 'c# runner', function() {
    describe( '.run', function() {
        runner.assertCodeExamples('csharp');

        it('should handle basic code evaluation', function (done) {
            runner.run({language: 'csharp',
                code: 'public class Hello1 { public static void Main() { System.Console.WriteLine("Hello, World!");}}'
            }, function (buffer)
            {
                //console.log(buffer);
                expect(buffer.stdout).to.contain('Hello, World!\n');
                done();
            });
        });

        it('should handle basic nunit tests', function (done) {
            runner.run({ language: 'csharp',
                code: 'namespace Bank { using System; public class Account { private decimal balance; public void Deposit(decimal amount) { Console.WriteLine("slorgs"); balance += amount; } public void Withdraw(decimal amount) { balance -= amount; } public void TransferFunds(Account destination, decimal amount) { } public decimal Balance { get { return balance; } } } } ',
                fixture: 'namespace Bank { using NUnit.Framework; [TestFixture] public class AccountTest { [Test] public void TransferFunds() { Account source = new Account(); source.Deposit(200m); Account destination = new Account(); destination.Deposit(150m); source.TransferFunds(destination, 100m); Assert.AreEqual(250m, destination.Balance); Assert.AreEqual(100m, source.Balance); } [Test] public void CheckFunds() { Account source = new Account(); source.Deposit(200m); Account destination = new Account(); destination.Deposit(150m); Assert.AreEqual(200m, source.Balance); } } } ' }, function (buffer)
            {
                //console.log(buffer);
                expect(buffer.stdout).to.contain("slorgs");
                expect(buffer.stdout).to.contain("<PASSED::>");
                expect(buffer.stdout).to.contain("<FAILED::>");
                expect(buffer.stdout).to.contain("<DESCRIBE::>");
                expect(buffer.stdout).to.contain("<IT::>");
                done();
            });
        });

        it('should handle bad code', function (done) {
            runner.run({ language: 'csharp',
                code: 'namespace Bank { using System; using System.Drawing; public class Account { private decimal balance; public void Deposit(decimal amount) { Console.WriteLine("slorgs"); balance += amount; } public void Withdraw(decimal amount) { balance -= Amount; } public void TransferFunds(Account destination, decimal amount) { } public decimal Balance { get { return balance; } } } } ',
                fixture: 'namespace Bank { using NUnit.Framework; [TestFixture] public class AccountTest { [Test] public void TransferFunds() { Account source = new Account(); source.Deposit(200m); Account destination = new Account(); destination.Deposit(150m); source.TransferFunds(destination, 100m); Assert.AreEqual(250m, destination.Balance); Assert.AreEqual(100m, source.Balance); } [Test] public void CheckFunds() { Account source = new Account(); source.Deposit(200m); Account destination = new Account(); destination.Deposit(150m); Assert.AreEqual(200m, source.Balance); } } } ' }, function (buffer)
            {
                //console.log(buffer);
                expect(buffer.stdout).to.not.contain("lib/runners/csharp.js");
                done();
            });
        });

        it('should handle partially passed code', function (done) {
            runner.run({ language: 'csharp',
                code: 'using System; public class Account { } ',
                fixture: 'using NUnit.Framework; [TestFixture] public class AccountTest { [Test] public void A() { Assert.AreEqual(1, 1); } [Test] public void Z() { Assert.AreEqual(1, 1); throw new System.Exception(); } } ' }, function (buffer)
            {
                expect(buffer.stdout).to.contain("<ERROR::>");
                done();
            });
        });
    });
});
