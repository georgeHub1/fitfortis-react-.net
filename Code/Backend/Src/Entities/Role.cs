﻿using System;
using Microsoft.AspNetCore.Identity;

namespace Backend.Entities
{
    public class Role : IdentityRole<Guid>, IBaseEntity<Guid>, IIdentifiable<Guid>
    {
        
    }
}
