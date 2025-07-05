// CUSTOM ICON COMPONENT
import duotone from "@/icons/duotone";
export const navigation = [
  {
    name: "Dashboards",
    Icon: duotone.PersonChalkboard,
    path: "/dashboard",
    // children: [
    // {
    //   name: "Dashboard",
    // },
    // {
    //   name: "Analytics 2",
    //   path: "/dashboard/analytics-2",
    // },
    // {
    //   name: "CRM 1",
    //   path: "/dashboard/crm",
    // },
    // {
    //   name: "CRM 2",
    //   path: "/dashboard/crm-2",
    // },
    // {
    //   name: "Sales 1",
    //   path: "/dashboard/sales",
    // },
    // {
    //   name: "Sales 2",
    //   path: "/dashboard/sales-2",
    // },
    // {
    //   name: "Finance 1",
    //   path: "/dashboard/finance",
    // },
    // {
    //   name: "Finance 2",
    //   path: "/dashboard/finance-2",
    // },
    // {
    //   name: "Ecommerce",
    //   path: "/dashboard/ecommerce",
    // },
    // {
    //   name: "Logistics",
    //   path: "/dashboard/logistics",
    // },
    // {
    //   name: "Marketing",
    //   path: "/dashboard/marketing",
    // },
    // {
    //   name: "LMS",
    //   path: "/dashboard/learning-management",
    // },
    // {
    //   name: "Job Management",
    //   path: "/dashboard/job-management",
    // },
    // ],
  },

  {
    name: "Patients",
    Icon: duotone.UserList,
    children: [
      {
        name: "Add Patient",
        path: "/dashboard/add-patient",
      },
      {
        name: "Patient List",
        path: "/dashboard/patient-list",
      },
      {
        name: "Patient Grid List",
        path: "/dashboard/patient-grid-list",
      },
      // {
      //   name: "User List 2",
      //   path: "/dashboard/patient-list-2",
      // },
      // {
      //   name: "User Grid 2",
      //   path: "/dashboard/user-grid-2",
      // },
    ],
  },
  {
    name: "Schedule call",
    Icon: duotone.AdminEcommerce,
    children: [
      {
        name: "Schedule call List",
        path: "/dashboard/schedule-call-list",
      },
      {
        name: "Schedule call",
        path: "/dashboard/schedule-call",
      },
      {
        name: "Call Details",
        path: "/dashboard/call-details",
      },
    ],
  },
  // {
  //   name: "Invoice",
  //   Icon: duotone.Invoice,
  //   children: [
  //     {
  //       name: "Invoice List",
  //       path: "/dashboard/invoice-list",
  //     },
  //     {
  //       name: "Invoice Details",
  //       path: "/dashboard/invoice-details",
  //     },
  //     {
  //       name: "Create Invoice",
  //       path: "/dashboard/create-invoice",
  //     },
  //   ],
  // },
  // {
  //   name: "Ecommerce",
  //   Icon: duotone.Ecommerce,
  //   children: [
  //     {
  //       name: "Cart",
  //       path: "/dashboard/cart",
  //     },
  //     {
  //       name: "Payment",
  //       path: "/dashboard/payment",
  //     },
  //     {
  //       name: "Billing Address",
  //       path: "/dashboard/billing-address",
  //     },
  //     {
  //       name: "Payment Complete",
  //       path: "/dashboard/payment-complete",
  //     },
  //   ],
  // },
  // {
  //   name: "Projects",
  //   Icon: duotone.ProjectChart,
  //   children: [
  //     {
  //       name: "Project 1",
  //       path: "/dashboard/projects/version-1",
  //     },
  //     {
  //       name: "Project 2",
  //       path: "/dashboard/projects/version-2",
  //     },
  //     {
  //       name: "Project 3",
  //       path: "/dashboard/projects/version-3",
  //     },
  //     {
  //       name: "Project Details",
  //       path: "/dashboard/projects/details",
  //     },
  //     {
  //       name: "Team Member",
  //       path: "/dashboard/projects/team-member",
  //     },
  //   ],
  // },
  // {
  //   name: "Data Table",
  //   Icon: duotone.DataTable,
  //   children: [
  //     {
  //       name: "Data Table 1",
  //       path: "/dashboard/data-table-1",
  //     },
  //   ],
  // },
  // {
  //   name: "Todo List",
  //   Icon: duotone.TodoList,
  //   path: "/dashboard/todo-list",
  // },
  {
    name: "Call History",
    Icon: duotone.Chat,
    path: "/dashboard/call-history",
  },
  {
    name: "Train Bot",
    Icon: duotone.Pages,
    children: [
      {
        name: "Media",
        path: "/dashboard/media",
      },
      {
        name: "Instruction",
        path: "/dashboard/instruction",
      },
      {
        name: "Life History",
        path: "/dashboard/life-history",
      },
    ],
  },
  {
    name: "Profile",
    Icon: duotone.UserProfile,
    path: "/dashboard/profile",
  },
  {
    name: "Account",
    Icon: duotone.Accounts,
    path: "/dashboard/account",
  },
  // {
  //   name: "Email",
  //   Icon: duotone.Inbox,
  //   children: [
  //     {
  //       name: "Inbox",
  //       path: "/dashboard/mail/all",
  //     },
  //     {
  //       name: "Email Details",
  //       path: "/dashboard/mail/details",
  //     },
  //     {
  //       name: "Create Email",
  //       path: "/dashboard/mail/compose",
  //     },
  //   ],
  // },
  // {
  //   name: "Pages",
  //   Icon: duotone.Pages,
  //   children: [
  //     {
  //       name: "About (Admin)",
  //       path: "/dashboard/about",
  //     },
  //     {
  //       name: "About (Public)",
  //       path: "/about-us",
  //     },
  //     {
  //       name: "Career (Admin)",
  //       path: "/dashboard/career",
  //     },
  //     {
  //       name: "Career (Public)",
  //       path: "/career",
  //     },
  //     {
  //       name: "Job Details",
  //       path: "/career/designer",
  //     },
  //     {
  //       name: "Job Apply",
  //       path: "/career/apply",
  //     },
  //     {
  //       name: "Shop",
  //       path: "/products",
  //     },
  //     {
  //       name: "Product Details",
  //       path: "/products/Wu4GdphiI0F48eMQZ_zBJ",
  //     },
  //     {
  //       name: "Cart",
  //       path: "/cart",
  //     },
  //     {
  //       name: "Checkout",
  //       path: "/checkout",
  //     },
  //     {
  //       name: "Faq",
  //       path: "/faqs",
  //     },
  //     {
  //       name: "Pricing",
  //       path: "/pricing",
  //     },
  //     {
  //       name: "Support",
  //       path: "/dashboard/support",
  //     },
  //     {
  //       name: "Create Ticket",
  //       path: "/dashboard/media",
  //     },
  //     {
  //       name: "File Manager",
  //       path: "/dashboard/file-manager",
  //     },
  //   ],
  // },
];
