import duotone from "@/icons/duotone";

export const roleWiseRouteAccess = [
  {
    roleName: "super_admin",
    routeAccess: [
      "/dashboard",
      "/dashboard/add-sub-admin",
      "/dashboard/sub-admin-list",
      "/dashboard/profile",
      "/dashboard/account",
      "/dashboard/add-care-home", // <-- New route for Add Care Home
      "/dashboard/care-home-list", // <-- New route for View Care Home
      "/dashboard/Call-test", // <-- Existing test route for Super Admin
      "/dashboard/demo-bot-analysis", // <-- New route for Demo Bot Analysis
      "/dashboard/Cold-Call-Script",
    ],
  },
  {
    roleName: "sub_admin",
    routeAccess: [
      "/dashboard",
      "/dashboard/add-care-home",
      "/dashboard/care-home-list",
      "/dashboard/profile",
      "/dashboard/account",
      "/dashboard/demo-bot-analysis",
      "/dashboard/Cold-Call-Script",
    ],
  },
  {
    roleName: "care_home",
    routeAccess: [
      "/dashboard",
      "/dashboard/add-patient",
      "/dashboard/patient-list",
      "/dashboard/patient-view",
      "/dashboard/patient-grid-list",
      "/dashboard/schedule-call",
      "/dashboard/schedule-call-list",
      "/dashboard/profile",
      "/dashboard/account",
      //"/dashboard/payment"
    ],
  },
  {
    roleName: "patient",
    routeAccess: [
      "/dashboard",
      "/dashboard/schedule-call-list",
      "/dashboard/call-history",
      //"/dashboard/photo-gallery",
      "/dashboard/account",
    ],
  },
  {
    roleName: "family_member",
    routeAccess: [
      "/dashboard",
      // "/dashboard/call-history",
      "/dashboard/schedule-call",
      "/dashboard/schedule-call-list",
      "/dashboard/account",
      "/dashboard/Profile",
      "/dashboard/training-logs",
      "/dashboard/media",
      "/dashboard/instruction",
      "/dashboard/life-history",
     // "/dashboard/topics",
    ],
  },
];

export const navigations = [
  {
    type: "label",
    label: "Dashboard",
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: duotone.Dashboard,
  },
  {
    type: "label",
    label: "Management",
    roleSpecific: ["care_home"],
  },
  {
    type: "label",
    label: "Overview",
    roleSpecific: ["patient", "family_member"],
  },
  // {
  //   name: "Sub Admin",
  //   icon: duotone.UserList,
  //   children: [
  //     {
  //       name: "Add Sub Admin",
  //       path: "/dashboard/add-sub-admin",
  //     },
  //     {
  //       name: "Sub Admin List",
  //       path: "/dashboard/sub-admin-list",
  //     },
  //   ],
  //   roleSpecific: ["super_admin"],
  // },
  {
    name: "Care Home",
    icon: duotone.UserList,
    children: [
      {
        name: "Add Care Home",
        path: "/dashboard/add-care-home",  // <-- Option for adding care home
      },
      {
        name: "View Care Home",  // <-- Option for viewing care home
        path: "/dashboard/care-home-list",  // <-- Add path for viewing care home
      }
    ],
    roleSpecific: [ "super_admin"],  // Both super_admin and care_home roles can see this
  },
  // {
  //   name: "MemoraBot",  // <-- New navigation module for Super Admin testing
  //   icon: duotone.CreateCall,
  //   path: "/dashboard/Call-test",  // <-- Add path for testing module
  //   roleSpecific: ["super_admin"],  // This is only visible to Super Admin
  // },
  {
    name: "Cold Call Script",  // <-- Name for the Cold Call Script navigation
    icon: duotone.CreateCall,  // <-- Choose an appropriate icon
    path: "/dashboard/Cold-Call-Script",  // <-- Path to the Cold Call Script page
    roleSpecific: ["sub_admin"],  // <-- Only visible to Super Admin
  },
  
  {
    name: "Patient",
    icon: duotone.UserList,
    children: [
      {
        name: "Add Patient",
        path: "/dashboard/add-patient",
      },
      {
        name: "Patient List",
        path: "/dashboard/patient-list",
      },
      // {
      //   name: "Patient Payment",  // New option for managing payment while adding a patient
      //   path: "/dashboard/payment",  // Path for payment management while adding a patient
      // },
    
    ],
    roleSpecific: ["care_home"],
  },
  // {
  //   name: "Photo Gallery",
  //   icon: duotone.PhotoGallery,
  //   path: "/dashboard/photo-gallery",
  //   roleSpecific: ["patient"],
  // },
   {
    name: "Schedule Call",
    icon: duotone.CreateCall,
    roleSpecific: ["care_home", "family_member"],
    children: [
      {
        name: "Call List",
        path: "/dashboard/schedule-call-list",
      },
      {
        name: "Schedule Call",
        path: "/dashboard/schedule-call",
      },
    ],
  },
  {
    name: "Calls List",
    icon: duotone.List,
    path: "/dashboard/schedule-call-list",
    roleSpecific: ["patient"],
  },
  // {
  //   name: "Call History",
  //   icon: duotone.Chat,
  //   path: "/dashboard/call-history",
  //   roleSpecific: ["family_member"],
  // },
  {
    name: "Train Bot",
    icon: duotone.Bot,
    children: [
      {
        name: "Media",
        path: "/dashboard/media",
      },
      // {
      //   name: "Instruction",
      //   path: "/dashboard/instruction",
      // },
      {
        name: "Life History",
        path: "/dashboard/life-history",
      },
      // {
      //   name: "Topics",
      //   path: "/dashboard/topics",
      // },
    ],
  },
  // {
  //   name: "Training Logs",
  //   icon: duotone.Logs,
  //   path: "/dashboard/training-logs",
  //   roleSpecific: ["family_member"],
  // },
  {
    type: "label",
    label: "Settings",
    roleSpecific: ["care_home", "family_member"],
  },
  // {
  //   name: "Profile",
  //   icon: duotone.UserProfile,
  //   path: "/dashboard/profile",
  //   roleSpecific: ["care_home","family_member"],
  // },
  {
    name: "Demo Bot Analysis",
    icon: duotone.Bot,
    roleSpecific: ["super_admin" ],
    children: [
      {
        name: "Analysis and controls",
        path: "/dashboard/demo-bot-analysis",
      },
      {  name: "Cold Call Script",
        path: "/dashboard/Cold-Call-Script",
      },
    ],
  },
  {
    name: "Account",
    icon: duotone.Accounts,
    path: "/dashboard/account",
    roleSpecific: ["care_home", "family_member", "super_admin" , "sub_admin"],
  },
  // {
  //   name: "Demo Bot Analysis",  // <-- New navigation module for Demo Bot Analysis
  //   icon: duotone.Bot ,  // Replace with the correct icon if necessary
  //   path: "/dashboard/demo-bot-analysis",
  //   roleSpecific: ["sub_admin"],  // Only visible to Super Admin
  // },
  
  
];




