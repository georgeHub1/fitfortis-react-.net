``` ini

BenchmarkDotNet=v0.12.1, OS=Windows 10.0.18362.719 (1903/May2019Update/19H1)
Intel Core i5-3550 CPU 3.30GHz (Ivy Bridge), 1 CPU, 4 logical and 4 physical cores
.NET Core SDK=3.1.301
  [Host]     : .NET Core 2.2.3 (CoreCLR 4.6.27414.05, CoreFX 4.6.27414.05), X64 RyuJIT
  Job-XJJMRG : .NET Core 2.2.3 (CoreCLR 4.6.27414.05, CoreFX 4.6.27414.05), X64 RyuJIT

IterationCount=10  WarmupCount=5  

```
|                   Method |        Mean |       Error |      StdDev |         Min |         Max |
|------------------------- |------------:|------------:|------------:|------------:|------------:|
|          GetEncyclopedia |  2,176.2 ms |   566.49 ms |   374.70 ms |  1,598.1 ms |  2,826.1 ms |
|             GetMedicines | 24,892.8 ms | 8,952.08 ms | 5,921.25 ms | 17,899.5 ms | 32,743.5 ms |
|          GetAllAnalytics |    203.4 ms |    54.52 ms |    28.51 ms |    188.0 ms |    273.2 ms |
|    GetDataForOneAnalytic |    188.0 ms |    38.10 ms |    22.67 ms |    172.6 ms |    239.6 ms |
|    GetDataForAllAnalytic |  5,092.1 ms | 1,091.29 ms |   570.76 ms |  4,440.1 ms |  5,952.0 ms |
|                 GetRoles |    177.6 ms |     5.93 ms |     3.10 ms |    174.6 ms |    183.1 ms |
|             GetAdminNews |  1,672.6 ms |   651.74 ms |   387.84 ms |  1,253.3 ms |  2,336.2 ms |
|   GetAdminNewsRecycleBin |    177.0 ms |    11.13 ms |     7.36 ms |    170.3 ms |    190.2 ms |
|    GetUsersWithAdminRole |    217.4 ms |    86.28 ms |    51.34 ms |    181.8 ms |    336.5 ms |
|      GetUserChartDetails |    260.8 ms |    17.13 ms |     8.96 ms |    252.3 ms |    278.2 ms |
|            GetAllMetrics |    176.9 ms |     4.15 ms |     2.47 ms |    174.4 ms |    182.4 ms |
|      GetAllMetricDetails |    218.1 ms |    45.17 ms |    23.62 ms |    196.5 ms |    250.5 ms |
|     GetAllNewsByLanguage |  1,061.3 ms |   401.02 ms |   238.64 ms |    882.8 ms |  1,555.3 ms |
|                    GetMe |    176.1 ms |     3.33 ms |     1.98 ms |    171.9 ms |    178.4 ms |
|       GetAllUserActivity |  2,702.0 ms | 1,086.84 ms |   718.88 ms |  1,893.0 ms |  4,323.8 ms |
| GetUserChronicConditions |  4,590.9 ms | 1,129.60 ms |   747.16 ms |  3,007.2 ms |  5,632.1 ms |
|     GetUserFamilyHistory |  1,275.5 ms |   577.64 ms |   382.08 ms |    650.8 ms |  1,884.7 ms |
|         GetUserTherapies |  1,163.0 ms |   519.41 ms |   343.56 ms |    803.9 ms |  1,775.8 ms |
|  GetUserBasicInformation |    178.4 ms |     6.26 ms |     3.73 ms |    173.0 ms |    184.9 ms |
|         GetUserLifestyle |    171.1 ms |     3.07 ms |     1.61 ms |    168.1 ms |    173.6 ms |
|          GetUserCheckups |    180.9 ms |     3.23 ms |     1.92 ms |    178.5 ms |    183.3 ms |
|           GetAllSymptoms |  2,700.9 ms | 1,456.09 ms |   963.12 ms |  1,807.1 ms |  4,450.2 ms |
|              GetAllUsers |    245.9 ms |    25.07 ms |    14.92 ms |    229.9 ms |    270.9 ms |
|       GetUserHealthIndex |    183.2 ms |     6.50 ms |     4.30 ms |    178.8 ms |    191.9 ms |
