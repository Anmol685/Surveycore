import { Campaign, Template, FeedbackComment } from "./types";

export const ALEX_PROFILE_PHOTO = "https://lh3.googleusercontent.com/aida-public/AB6AXuAQldaflGGfHmRsVmXTsBjCLkYqgjJVOX6hADc-t_WQbr5q31XBS5mscj-gjtX4KEcuJPqB48FQC7I_rF9YVSp0YIsHHoFoovF9GxWfTbGaRZJbQ2IUkgxQajG8-Fp4DVFKSGqZAK8c4716m45OoAvqygTcHtD7zg2YP7vXYfoJXcm0p6iK8GxASaSopzwU2P5hALfvrvWfzxPaG-DPyIlIlZiVzW2ho17c9pygvC8kjZMZ6Kw84gTfyeiCrkGOyt8IfmxYvAEppTs";
export const ANMOL_PROFILE_PHOTO = "https://lh3.googleusercontent.com/aida-public/AB6AXuBNAP4j12S6MU5ytPHrjCTpkQrzM4iRJcU3HaIWlPZV-YxokhgEDfBReHbfPj-Gco650kPTztUnw9bR0g4VPPlZrglrVqxV-ZzyzvLdtZxf0NQOZdqUXenKIJ2cgqE3gxeAzLzmW8u6w9rZKJiXZ6anlbeWvawEh4_iCvRTrxMZuLE00Ab5toKbp1FXuzo-qJ8npvLAnpTg0WpNpAPmUc2hdeYFglNkG00fVpQK59-_ysmrhNM0IQLjALxGH9A1sOgQgM_3j05d7oc";

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp_q3_wave",
    name: "Q3 Feedback Wave",
    title: "How are we doing?",
    subtitle: "We value your feedback. Let us know how your experience was.",
    status: "ACTIVE",
    ratingType: "stars",
    targetAudience: "Premium Subscribers",
    tags: ["Fast Delivery", "Easy Setup", "Great Quality"],
    allowComments: true,
    submitButtonText: "Submit Feedback",
    responsesCount: 4120,
    csatScore: 4.8,
    modifiedAt: "Modified 2h ago"
  },
  {
    id: "camp_purch_v2",
    name: "Post-Purchase v2",
    title: "How was your purchase?",
    subtitle: "Your insights help us craft friction-free shopping journeys.",
    status: "DRAFT",
    ratingType: "numbers",
    targetAudience: "Recent Purchasers",
    tags: ["Checkout Ease", "Product Range", "Delivery Speed"],
    allowComments: true,
    submitButtonText: "Complete Survey",
    responsesCount: 0,
    csatScore: null,
    modifiedAt: "Modified yesterday"
  },
  {
    id: "camp_onboarding_sprint",
    name: "Onboarding Sprint",
    title: "How was your setup?",
    subtitle: "Let us know if we got you started smoothly and quickly.",
    status: "COMPLETED",
    ratingType: "stars",
    targetAudience: "All New Accounts",
    tags: ["Easy Setup", "Clear Guides", "Support Help"],
    allowComments: true,
    submitButtonText: "Send Evaluation",
    responsesCount: 2489,
    csatScore: 4.6,
    modifiedAt: "Ended Oct 12"
  },
  {
    id: "camp_q4_customer_success",
    name: "Q4 Customer Success",
    title: "Rate your account management team",
    subtitle: "We thrive on helping you expand your capabilities efficiently.",
    status: "ACTIVE",
    ratingType: "numbers",
    targetAudience: "Enterprise Clients",
    tags: ["Strategic Value", "Response Time", "Expert Guidance"],
    allowComments: true,
    submitButtonText: "Submit Response",
    responsesCount: 1240,
    csatScore: 4.82,
    modifiedAt: "Active • Started Oct 12, 2023"
  }
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: "tmpl_star_rating",
    title: "Minimal Star Rating",
    description: "A sleek, one-question survey designed for high completion rates in post-interaction emails.",
    category: "CSAT",
    rating: 4.9,
    timeToComplete: 1,
    isPopular: true,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0qjkfZ67ThhVrIsGlSxiZ7__czhdy3OPaDBKL04IkY1RLTTKozAqbLRWogR8Xa9Y8si6WUoHqEkypxAphOWGo7qp5cCskz30u-kZhj73BaQetgCHB122Gyq1bp_5YVS26gF8M9COfGWtwJNbDGTUgc5321G17DPJFrgHwU1Ld1xsuapSBBHyWvYxslyKPR6xJGXKe-WUICt9g2cjvv-nJyp7xWvrG_L3C_9tzJ9_vgJIjY9dJfkg4X4IgqnSeXJ8RZC2dSjQkyTI",
    submitButtonText: "Submit Feedback",
    tags: ["Seamless", "Friendly", "Effective"],
    questions: [
      {
        id: "q_stars",
        type: "CSAT",
        text: "Overall, how satisfied are you with our service and quality today?",
        options: []
      }
    ]
  },
  {
    id: "tmpl_detailed_form",
    title: "Detailed Feedback Form",
    description: "Multi-step survey with branching logic to dive deep into user sentiment and pain points.",
    category: "CSAT",
    rating: 4.7,
    timeToComplete: 4,
    isDetailed: true,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFVQnlBqTeJp8svEkfjKSUwYRo-2L4Js2Nw4nxrerDuIL39VSTmb3Teb0hUJqAY3tExVnzpSTqpMNcz8t6y6eVxqfkDRTLVZDS1mpviD-lFwTSi0VfVcjZYnhIzlwmgxLCVf0wnN6zD0a4fvCeHu26A0Ws0v2BikM2QgIp-yIh7zhpjGYR1_Ddt69gRfkxtgi7LByPepKmRRhqksHbGFhi8Bf-gvNumolIkPSgz_rhAiLJnFkEQ4re0Z0IrQm6ZolP5mGsKV48MNE",
    submitButtonText: "Complete Feedback Form",
    tags: ["Interface", "Friction Points", "Speed"],
    questions: [
      {
        id: "q_csat_core",
        type: "CSAT",
        text: "How would you rate your overall platform satisfaction?",
        options: []
      },
      {
        id: "q_mult_choice",
        type: "MultipleChoice",
        text: "Which aspect of the platform needs the most refinement?",
        options: ["Interface & Styling", "Slow API loading speeds", "Component logical limits", "Clarity of help docs"]
      },
      {
        id: "q_nps_ref",
        type: "NPS",
        text: "How likely are you to recommend SurveyCore to other success managers?",
        options: []
      }
    ]
  },
  {
    id: "tmpl_ticket_resolution",
    title: "Ticket Resolution Pulse",
    description: "Optimized for Zendesk/Salesforce integrations to measure support performance instantly.",
    category: "CSAT",
    rating: 5.0,
    timeToComplete: 2,
    isNew: true,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHO7yZ21ZO48mA_hD3EYgDxUjS6xe6OVVG6Ktflyfva1L7IwmiYpSu0PnFKI-wbD3_KE43BED8PN7XXsQm239QxdeAa4idaeG9hRMHLPSqs9Jlb8gr9dxm65WYFuTmWkfZ1yXQp_JBS39yyUXjAYUCmE7h-TRwG2OGq__rBzB_eslGPbunJ9I9Pks8BfsV_v3OrVQF_GylCZZ90Yu5nIDVn_Ym7o1_LiUhGyc-raWxspEV2XJPhAkhjYjiK9JN2irkqMj59SiA6d0",
    submitButtonText: "Submit Rating",
    tags: ["Quick Solution", "Expert Help", "Patience"],
    questions: [
      {
        id: "q_tick_sat",
        type: "CSAT",
        text: "How satisfied are you with the technical capability shown by our representative?",
        options: []
      },
      {
        id: "q_resol",
        type: "MultipleChoice",
        text: "Was your issue resolved completely during the session?",
        options: ["Yes, completely", "Yes, but with temporary workarounds", "No, it's still pending attention"]
      }
    ]
  },
  {
    id: "tmpl_checkout_exp",
    title: "Checkout Experience",
    description: "Short, impactful survey to catch frictions in the payment and checkout flow.",
    category: "Post-Purchase",
    rating: 4.8,
    timeToComplete: 1,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-7cPezu93im3dygZE-qsRmi46i4l5IW9L0Su4TWVoG7J5LcsHqRNBcKu2IMmCHmTWucZCT4U-1YCSneYEpdNFRsiUrIy7jVL3HKMSGcZtm5FyNs0vPRri4Zs1ZdTRNfB4L9QO8txTzbOn88hr396TCwDn2oBf65o3XUOV58qi6oZqREJf4R07_vz_g6fVmM_IlFwa4YO7n8hV-w9lixFHB28uHAs6XAUYjNuSxusVV4uPACsrdiRhb0IVXFBgvfo0BJO0oEZ4vYs",
    submitButtonText: "Submit Experience Feedback",
    tags: ["Secure", "Smooth Check", "Payment Methods"],
    questions: [
      {
        id: "q_check_sat",
        type: "CSAT",
        text: "Rate the speed and comfort of our modern responsive checkout.",
        options: []
      },
      {
        id: "q_fr",
        type: "MultipleChoice",
        text: "Did you receive any payment gateway processing errors?",
        options: ["None, completely smooth", "Yes, slow gateway redirect", "Yes, card got rejected once"]
      }
    ]
  },
  {
    id: "tmpl_unboxing_sat",
    title: "Unboxing Satisfaction",
    description: "Focuses on physical product quality and the first impression of the delivery experience.",
    category: "Post-Purchase",
    rating: 4.6,
    timeToComplete: 3,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeSJ_3_pPeonKUr0FyN-nM3HxrffvNUKWV2OZq7zfbwPBIWMgRCEU4WENdNbU_JzH8Kh6OuwYMgem-93soQh6AbeJL2qrDyHsTKTZlmiBbgrEKbtTd5QbkU78WD0PvP-MNKJrNvEXgXrufcbUqr_p4ICLeAOUjT4hxcyNavIQ1XeTi_O1n0tOIOo888fpmyMYSAyU_0Xl3K44CxqzKfIPb7-EwkGPBPXG3vHxngHYttiL0N0TQyl49eJDQ_qnAUTXYHlGoj_qLqJA",
    submitButtonText: "Submit Satisfaction Score",
    tags: ["Premium Box", "Protective Packing", "On Time"],
    questions: [
      {
        id: "q_unbox",
        type: "CSAT",
        text: "Rate your satisfaction with the visual quality of the product packaging.",
        options: []
      }
    ]
  }
];

export const INITIAL_FEEDBACK_COMMENTS: FeedbackComment[] = [
  {
    id: "f1",
    userName: "Jane Doe",
    avatarUrl: ALEX_PROFILE_PHOTO,
    rating: 5,
    comment: "The new onboarding flow is incredibly intuitive. It saved our team hours of setup time.",
    date: "1 hour ago",
    tags: ["Onboarding", "UX Design"]
  },
  {
    id: "f2",
    userName: "Mark Smith",
    avatarUrl: ANMOL_PROFILE_PHOTO,
    rating: 3,
    comment: "Decent experience, but I found the dashboard loading times a bit sluggish during peak hours.",
    date: "4 hours ago",
    tags: ["Performance"]
  },
  {
    id: "f3",
    userName: "Alex K.",
    rating: 5,
    comment: "The star rating systems integrate perfectly with Zendesk support pipelines. CSAT instantly jumped up 4%!",
    date: "Yesterday",
    tags: ["Integrations", "Zendesk"]
  },
  {
    id: "f4",
    userName: "Sophia Loren",
    rating: 4,
    comment: "Excellent presentation. The NPS tracking helps us understand why we receive repeat orders.",
    date: "3 days ago",
    tags: ["NPS Track"]
  }
];
