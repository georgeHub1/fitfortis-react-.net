# Writing C# Scripts
---

# Introduction
The DOTNET-SCRIPT tool allows exection of .NET C# code as scripts.
For information see:
* https://www.hanselman.com/blog/CAndNETCoreScriptingWithTheDotnetscriptGlobalTool.aspx
* https://github.com/filipw/dotnet-script/blob/master/README.md

# Installation
1. Install the DOTNET-SCRIPT tool, using the following command:
```
> dotnet tool install -g dotnet-script
```

2. At this point you are ready to execute your first script. Simply create the obligatory 
`HelloWorld.csx` file...
```
#! /usrbin/env dotnet-script

Console.WriteLine("Hello world!");
```

... then execute it from the console:
```
> dotnet script HelloWorld.csx
Hello world!
```

# Using .NET packages
If you need to use .NET packages, you need to reference them, using a #r directive as follows:
```
#! /usrbin/env dotnet-script
#r "nuget: System.Data.SqlClient,4.6.0"

using System;
using System.Data.SqlClient;
using System.Text;

try
{
    SqlConnectionStringBuilder b = new SqlConnectionStringBuilder();
}
catch (SqlException e)
{
    Console.WriteLine(e.ToString());
}
```

# Next steps
See the CSX files in this directory. The samples as prepended with `__Sample` (e.g. `__SampleGuidGenerator.csx`)

