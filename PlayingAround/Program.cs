//ref c#
Console.WriteLine("Ref");
Console.WriteLine("--------------------------------------------");
var testRefObject = new TestObject { Text = "Hello" };
Console.WriteLine(testRefObject.Text + ' ' + testRefObject.GetHashCode());
AddRefObject(ref testRefObject);
Console.WriteLine(testRefObject.Text + ' ' + testRefObject.GetHashCode());
ChangeRefObject(ref testRefObject);
Console.WriteLine(testRefObject.Text + ' ' + testRefObject.GetHashCode());
Console.WriteLine("--------------------------------------------");
var testRefObject2 = new TestObject { Text = "Hello2" };
Console.WriteLine(testRefObject2.Text + ' ' + testRefObject2.GetHashCode());
AddObject(testRefObject2);
Console.WriteLine(testRefObject2.Text + ' ' + testRefObject2.GetHashCode());
ChangeObject(testRefObject2);
Console.WriteLine(testRefObject2.Text + ' ' + testRefObject2.GetHashCode());
Console.WriteLine("--------------------------------------------");
var x = 0;
AddRefValue(ref x);
Console.WriteLine(x);
ChangeRefValue(ref x);
Console.WriteLine(x);
Console.WriteLine("--------------------------------------------");
var y = 0;
AddValue(y);
Console.WriteLine(y);
ChangeValue(y);
Console.WriteLine(y);
Console.WriteLine("--------------------------------------------");

//out c#
Console.WriteLine("Out");
Console.WriteLine("--------------------------------------------");
TestObject testOutObject;
//Console.WriteLine(testOutObject.Text + ' ' + testOutObject.GetHashCode());
AddOutObject(out testOutObject);
Console.WriteLine(testOutObject.Text + ' ' + testOutObject.GetHashCode());
Console.WriteLine("--------------------------------------------");
int testOutValue;
//Console.WriteLine(testOutValue);
AddOutValue(out testOutValue);
Console.WriteLine(testOutValue);
Console.WriteLine("--------------------------------------------");

//in c#
Console.WriteLine("In");
Console.WriteLine("--------------------------------------------");
TestObject testInObject = new TestObject { Text = "Hello" };
Console.WriteLine(testInObject.Text + ' ' + testInObject.GetHashCode());
AddInObject(in testInObject);
Console.WriteLine(testInObject.Text + ' ' + testInObject.GetHashCode());
Console.WriteLine("--------------------------------------------");
int testInValue = 0;
Console.WriteLine(testInValue);
AddInValue(in testInValue);
Console.WriteLine(testInValue);
Console.WriteLine("--------------------------------------------");

//value parameter c#
//TestObject testObject = new TestObject { Text = "Hello" };
//Console.WriteLine(testObject.Text + ' ' + testObject.GetHashCode());
//AddValueObject(testObject);
//Console.WriteLine(testObject.Text + ' ' + testObject.GetHashCode());
//int testValue = 0;
//Console.WriteLine(testValue);
//AddValue(testValue);
//Console.WriteLine(testValue);

//dynamic c#
int val = 10;
string s = "111";
mulval(s); //error CS1503: Argument 1: cannot convert from 'string' to 'dynamic'
mulval(val);


//virtual method c#
// BaseClass baseClass = new BaseClass();
// baseClass.Method1();
// ChildClass childClass = new ChildClass();
// childClass.Method1();
// childClass.Method2();
// BaseClass baseClassChild = new ChildClass();
// baseClassChild.Method1();
// baseClassChild.Method2();
// ((ChildClass)baseClassChild).Method2();
// Console.WriteLine(baseClassChild.GetType().Name);

void mulval(dynamic val)
{
    val *= val;
    Console.WriteLine(val);
}
void AddValueObject(TestObject obj)
{
    obj.Text = "World";
    obj = new TestObject { Text = "Hello from AddValueObject" };
}

void AddInValue(in int intVal)
{
    //intVal = 10; // Error: Cannot assign to variable 'in int' because it is a readonly variable
}
void AddInObject(in TestObject obj)
{
    //obj = new TestObject { Text = "Hello from AddInObject" }; // Error: Cannot assign to variable 'in TestObject' because it is a readonly variable
    obj.Text += "World";
}
void AddOutObject(out TestObject obj)
{
    obj = new TestObject { Text = "Hello from AddOutObject" };
}
void AddOutValue(out int intVal)
{
    intVal = 10;
}

void AddValue(int intVal)
{
    intVal = 10;
}

void AddRefValue(ref int intVal)
{
    intVal = 10;
}

void ChangeValue(int intVal)
{
    intVal = new int();
    intVal = 20;
}

void ChangeRefValue(ref int intVal)
{
    intVal = new int();
    intVal = 20;
}
void AddRefObject(ref TestObject obj)
{
    obj.Text = "World";
}

void ChangeRefObject(ref TestObject obj)
{
    obj = new TestObject { Text = "Hello from ChangeRefObject" };
}

void AddObject(TestObject obj)
{ 
    obj.Text = "World2";
}

void ChangeObject(TestObject obj)
{
    obj = new TestObject { Text = "Hello from ChangeObject" };
}

class TestObject
{
    public string Text { get; set; }
}

class BaseClass
{
    public virtual void Method1()
    {
        Console.WriteLine("Base - Method1");
    }
    public virtual void Method2()
    {
        Console.WriteLine("Base - Method2");
    }
}
class ChildClass : BaseClass
{
    public override void Method1()
    {
        Console.WriteLine("Child - Method1");
    }

    public void Method2()
    {
        Console.WriteLine("Child - Method2");
    }
}