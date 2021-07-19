#! /usrbin/env dotnet-script

int n = 325;
Console.WriteLine("Int:  {0}", n);
Console.WriteLine("Guid: {0}", GuidFromInt(n).ToString("D"));

//
//  Generate a GUID, where the last 12 characters are a given INT
//
public static Guid GuidFromInt(int i)
{
    Guid g1 = Guid.NewGuid();
    string s1 = g1.ToString("D");

    string s2 = s1.Substring(0, 24) + i.ToString().PadLeft(12, '0');
    Guid g2 = Guid.Parse(s2);
    return g2;
}
