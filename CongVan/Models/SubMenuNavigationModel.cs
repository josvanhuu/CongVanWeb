﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CongVan.Models
{
    public class SubMenuNavigationModel
    {
        public Dictionary<string, string> Links { get; set; }

        public SubMenuNavigationModel()
        {
            Links = new Dictionary<string, string>();
        }
    }
}