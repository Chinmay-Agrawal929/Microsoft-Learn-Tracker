import { LearningTrack } from '../types';

export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'cloud',
    name: 'Cloud Architecture & Infrastructure',
    tagline: 'Master Azure computing, networking, identity, storage, and enterprise architecture',
    description: 'A progressive roadmap from cloud fundamentals to enterprise solutions architect expert certifications on Microsoft Azure.',
    accentColor: '#0078D4', // Microsoft Azure Blue
    badgeIcon: 'Cloud',
    certifications: [
      {
        id: 'az-900',
        domainId: 'cloud',
        code: 'AZ-900',
        title: 'Microsoft Azure Fundamentals',
        level: 'Fundamentals',
        icon: 'Sparkles',
        description: 'Demonstrate foundational knowledge of cloud concepts, Azure services, workloads, security, privacy, pricing, and support.',
        learnUrl: 'https://learn.microsoft.com/credentials/certifications/azure-fundamentals/',
        examUrl: 'https://learn.microsoft.com/credentials/certifications/exams/az-900/',
        totalXp: 4800,
        prerequisites: [],
        color: '#0078D4',
        modules: [
          {
            id: 'az-900-mod-1',
            certId: 'az-900',
            title: 'Describe Cloud Computing Core Concepts',
            description: 'Understand shared responsibility model, IaaS, PaaS, SaaS, and public/private/hybrid cloud definitions.',
            learnUrl: 'https://learn.microsoft.com/training/modules/describe-cloud-compute/',
            estimatedMinutes: 45,
            xp: 900,
            prerequisites: [],
            order: 1,
            skillsCovered: ['Cloud Architecture', 'SaaS/PaaS/IaaS', 'Shared Responsibility'],
            tasks: [
              { id: 'az900-1-1', title: 'Define cloud computing and its benefits (scalability, elasticity, agility)', type: 'reading', durationMinutes: 15, completed: false },
              { id: 'az900-1-2', title: 'Differentiate CapEx vs OpEx cloud expenditure models', type: 'reading', durationMinutes: 15, completed: false },
              { id: 'az900-1-3', title: 'Complete Knowledge Check: Core Cloud Concepts', type: 'knowledge_check', durationMinutes: 15, completed: false }
            ],
            architectureTip: 'Under the Shared Responsibility Model, regardless of deployment model (IaaS, PaaS, SaaS), the customer ALWAYS retains responsibility for Information & Data, Devices (Endpoints), and Accounts & Identities.',
            examTip: 'High Availability = uptime with redundancy. Scalability = handling increased workloads. Elasticity = automatically dynamically growing and shrinking based on real-time spikes.',
            scenarioStudy: 'Contoso Ltd. needs to migrate their legacy on-premise accounting SQL databases without hardware CapEx. They chose Azure PaaS (Azure SQL Database) to eliminate operating system patching overhead while maintaining complete data governance.',
            cheatSheet: [
              'IaaS: You manage OS, Runtime, Apps, Data. Cloud provider manages Hardware, Hypervisor, Physical Network.',
              'PaaS: You manage Apps and Data. Provider manages OS, Patching, Runtimes, Servers.',
              'SaaS: You only consume software (e.g., Microsoft 365). Provider manages everything.',
              'CapEx (Capital Expenditure): Upfront physical infrastructure cost. OpEx (Operational): Pay-as-you-go subscription consumption.'
            ]
          },
          {
            id: 'az-900-mod-2',
            certId: 'az-900',
            title: 'Azure Architecture, Regions & Compute Services',
            description: 'Explore Azure regions, availability zones, resource groups, virtual machines, containers, and serverless compute.',
            learnUrl: 'https://learn.microsoft.com/training/modules/describe-core-azure-concepts/',
            estimatedMinutes: 60,
            xp: 1200,
            prerequisites: ['az-900-mod-1'],
            order: 2,
            skillsCovered: ['Regions & AZs', 'Virtual Machines', 'Azure App Service', 'Serverless Functions'],
            tasks: [
              { id: 'az900-2-1', title: 'Explore Azure Regions and Region Pairs architecture', type: 'reading', durationMinutes: 20, completed: false },
              { id: 'az900-2-2', title: 'Interactive Sandbox: Create an Azure Virtual Machine and Web App', type: 'lab', durationMinutes: 25, completed: false, learnUrl: 'https://learn.microsoft.com/training/modules/describe-core-azure-concepts/3-describe-core-components' },
              { id: 'az900-2-3', title: 'Complete Knowledge Check: Compute & Networking basics', type: 'knowledge_check', durationMinutes: 15, completed: false }
            ],
            architectureTip: 'Availability Zones (AZs) are physically separate datacenters within the SAME Azure region, connected by low-latency fiber (<2ms). Use AZs for 99.99% VM SLA protection against datacenter-level failures.',
            examTip: 'Region Pairs are located at least 300 miles apart in the same geography (e.g., East US & West US) for disaster recovery and prioritized automated OS update sequencing.',
            scenarioStudy: 'An e-commerce retailer deploys multi-zone Azure App Service plans across Zone 1, 2, and 3 in East US to prevent total checkout system downtime during power or cooling failures in a specific datacenter.',
            cheatSheet: [
              'Azure Sovereign Regions: Azure Government (US DoD compliance), Azure China 21Vianet.',
              'Resource Groups: Management boundary for lifecycle, RBAC, and billing tags. Cannot be nested.',
              'Azure Virtual Desktop (AVD): Cloud-based virtualization for Windows 10/11 multi-session desktops.',
              'Azure Functions: Event-driven serverless compute (pay only when code executes).'
            ]
          },
          {
            id: 'az-900-mod-3',
            certId: 'az-900',
            title: 'Azure Storage & Database Fundamentals',
            description: 'Learn Azure Blob Storage, Disk Storage, Files, Azure SQL, Cosmos DB, and data redundancy strategies (LRS, GRS, ZRS).',
            learnUrl: 'https://learn.microsoft.com/training/modules/describe-azure-storage-services/',
            estimatedMinutes: 50,
            xp: 1100,
            prerequisites: ['az-900-mod-2'],
            order: 3,
            skillsCovered: ['Blob Storage', 'Azure Files', 'Cosmos DB', 'Redundancy Options'],
            tasks: [
              { id: 'az900-3-1', title: 'Compare Storage tiers (Hot, Cool, Cold, Archive)', type: 'reading', durationMinutes: 20, completed: false },
              { id: 'az900-3-2', title: 'Interactive Sandbox: Deploy Azure Storage Account & upload blobs', type: 'lab', durationMinutes: 20, completed: false },
              { id: 'az900-3-3', title: 'Knowledge Check: Storage & Database replication', type: 'knowledge_check', durationMinutes: 10, completed: false }
            ],
            architectureTip: 'Archive Tier storage offers the lowest storage cost but requires several hours for data rehydration. For disaster recovery redundancy, Geo-Zone-Redundant Storage (GZRS) combines high availability across 3 zones with cross-region replication.',
            examTip: 'Azure Cosmos DB guarantees single-digit millisecond latency SLAs at any scale with multi-region write master capability (99.999% availability).',
            scenarioStudy: 'A healthcare analytics firm stores 5 years of historical patient scans in Azure Blob Storage Archive tier, lifecycle-configured to automatically transition from Hot to Cool after 30 days and Archive after 90 days, cutting storage expenses by 72%.',
            cheatSheet: [
              'LRS (Locally Redundant): 3 copies in single datacenter (11 nines durability).',
              'ZRS (Zone Redundant): 3 copies across 3 availability zones in same region (12 nines).',
              'GRS (Geo-Redundant): 3 copies in primary + 3 copies in secondary paired region (16 nines).',
              'Azure Files: Standard SMB/NFS protocol support for mounting direct network shares on Windows/Linux/macOS.'
            ]
          },
          {
            id: 'az-900-mod-4',
            certId: 'az-900',
            title: 'Azure Identity, Governance, Pricing & Compliance',
            description: 'Deep dive into Microsoft Entra ID, RBAC role-based access control, Azure Policy, Cost Management, and SLA calculations.',
            learnUrl: 'https://learn.microsoft.com/training/modules/describe-azure-identity-access-security/',
            estimatedMinutes: 65,
            xp: 1600,
            prerequisites: ['az-900-mod-3'],
            order: 4,
            skillsCovered: ['Microsoft Entra ID', 'Azure RBAC', 'Azure Policy', 'Cost Management & SLAs'],
            tasks: [
              { id: 'az900-4-1', title: 'Understand Entra ID authentication, MFA, and Conditional Access', type: 'reading', durationMinutes: 25, completed: false },
              { id: 'az900-4-2', title: 'Interactive Lab: Configure Role-Based Access Control (RBAC)', type: 'lab', durationMinutes: 25, completed: false },
              { id: 'az900-4-3', title: 'Take Final AZ-900 Full Practice Assessment', type: 'knowledge_check', durationMinutes: 15, completed: false }
            ],
            architectureTip: 'Enforce Defense-in-Depth using Microsoft Entra ID Conditional Access policies, combined with Azure Policy for guardrail enforcement and Azure Key Vault for hardware security module (HSM) secret isolation.',
            examTip: 'Azure Policy enforces resource standards and compliance (e.g. prevent VM creation in unauthorized regions). Azure RBAC controls user permissions and role authorization (e.g. Owner, Contributor, Reader).',
            scenarioStudy: 'Financial auditing client enforces an Azure Policy initiative that automatically denies creation of unencrypted storage accounts and prevents any public IP assignments to internal database subnets.',
            cheatSheet: [
              'Zero Trust Principles: Verify explicitly, Use least privilege access, Assume breach.',
              'Microsoft Entra ID: Cloud identity and access management (IAM) supporting SSO, MFA, and B2B/B2C.',
              'Azure Pricing Calculator: Estimates monthly cloud cost before deploying resources.',
              'Azure Total Cost of Ownership (TCO) Calculator: Compares on-premises datacenter costs vs Azure migration savings.'
            ]
          }
        ]
      },
      {
        id: 'az-104',
        domainId: 'cloud',
        code: 'AZ-104',
        title: 'Microsoft Azure Administrator',
        level: 'Associate',
        icon: 'Server',
        description: 'Implement, manage, and monitor identity, governance, storage, compute, and virtual networks in cloud environments.',
        learnUrl: 'https://learn.microsoft.com/credentials/certifications/azure-administrator/',
        examUrl: 'https://learn.microsoft.com/credentials/certifications/exams/az-104/',
        totalXp: 8200,
        prerequisites: ['az-900'],
        color: '#008AD8',
        modules: [
          {
            id: 'az-104-mod-1',
            certId: 'az-104',
            title: 'Manage Azure Identities and Governance',
            description: 'Configure Microsoft Entra users, groups, licenses, administrative units, and subscription-level governance.',
            learnUrl: 'https://learn.microsoft.com/training/paths/az-104-manage-identities-governance/',
            estimatedMinutes: 90,
            xp: 2000,
            prerequisites: ['az-900-mod-4'],
            order: 1,
            skillsCovered: ['Entra User Mgmt', 'Self-Service Password Reset', 'Azure Policies', 'Resource Locks'],
            tasks: [
              { id: 'az104-1-1', title: 'Configure Entra ID user accounts, guest access, and security groups', type: 'reading', durationMinutes: 30, completed: false },
              { id: 'az104-1-2', title: 'Hands-on Lab: Assign custom RBAC roles and apply Azure Policies', type: 'lab', durationMinutes: 40, completed: false },
              { id: 'az104-1-3', title: 'Identity & Governance Mastery Assessment', type: 'knowledge_check', durationMinutes: 20, completed: false }
            ],
            architectureTip: 'Implement Microsoft Entra Privileged Identity Management (PIM) for Just-in-Time (JIT) role elevation with approval workflows and time-bound duration (max 8 hours).',
            examTip: 'Management Group hierarchy: Root Management Group ➔ Child Management Groups ➔ Subscriptions ➔ Resource Groups ➔ Resources. Policies and RBAC inherit downwards.',
            scenarioStudy: 'Enterprise multinational sets up 4 Management Groups by department (Finance, Engineering, HR, Shared Services) and applies an Azure Policy that mandates cost-center billing tags across all 120 subscriptions.',
            cheatSheet: [
              'Administrative Units: Delegate administrative control of specific users/groups without granting tenant-wide admin rights.',
              'Resource Lock: CanNotDelete (can read/modify, cannot delete), ReadOnly (cannot modify or delete). Locks override RBAC.',
              'Custom RBAC Role: Defined via JSON with "Actions", "NotActions", "AssignableScopes".'
            ]
          },
          {
            id: 'az-104-mod-2',
            certId: 'az-104',
            title: 'Implement and Manage Azure Storage Solutions',
            description: 'Manage storage accounts, Blob lifecycle management, object replication, Azure Files shares, and storage security.',
            learnUrl: 'https://learn.microsoft.com/training/paths/az-104-implement-manage-storage/',
            estimatedMinutes: 80,
            xp: 1800,
            prerequisites: ['az-104-mod-1'],
            order: 2,
            skillsCovered: ['Blob Lifecycle Policies', 'Shared Access Signatures (SAS)', 'Azure Files & File Sync'],
            tasks: [
              { id: 'az104-2-1', title: 'Configure Storage Account encryption and SAS tokens', type: 'reading', durationMinutes: 25, completed: false },
              { id: 'az104-2-2', title: 'Hands-on Lab: Configure Azure File Shares with active directory auth', type: 'lab', durationMinutes: 35, completed: false },
              { id: 'az104-2-3', title: 'Storage Administration Exam Prep Check', type: 'knowledge_check', durationMinutes: 20, completed: false }
            ],
            architectureTip: 'Prefer Shared Access Signatures (SAS) with User Delegation SAS (secured with Entra ID credentials) over Account SAS to avoid exposing master storage access keys.',
            examTip: 'Azure File Sync can tier cold files from local Windows File Servers to Azure Files while keeping hot cache files locally.',
            scenarioStudy: 'Media studio configures Blob Object Replication between primary storage in West Europe and secondary storage in North Europe to distribute 4K video assets with <15 min replication lag.',
            cheatSheet: [
              'Blob Lifecycle Management: Automate rules (e.g. daysAfterModificationGreaterThan: 30 ➔ tierToCool).',
              'Azure Storage Firewalls: Allow access from "Selected networks" (Specific VNets and Public IP ranges only).',
              'Immutability: Time-based retention policies (WORM - Write Once, Read Many) for compliance.'
            ]
          },
          {
            id: 'az-104-mod-3',
            certId: 'az-104',
            title: 'Deploy and Manage Azure Virtual Machines & Containers',
            description: 'Automate deployment using ARM templates & Bicep, scale sets (VMSS), container instances (ACI), and AKS clusters.',
            learnUrl: 'https://learn.microsoft.com/training/paths/az-104-manage-compute-resources/',
            estimatedMinutes: 110,
            xp: 2200,
            prerequisites: ['az-104-mod-2'],
            order: 3,
            skillsCovered: ['VM Scale Sets', 'Bicep Templates', 'Azure Container Instances', 'App Services'],
            tasks: [
              { id: 'az104-3-1', title: 'Author and deploy infrastructure using Bicep templates', type: 'reading', durationMinutes: 30, completed: false },
              { id: 'az104-3-2', title: 'Hands-on Lab: Deploy Auto-scaling Virtual Machine Scale Set', type: 'lab', durationMinutes: 50, completed: false },
              { id: 'az104-3-3', title: 'Compute & Containers Practice Check', type: 'knowledge_check', durationMinutes: 30, completed: false }
            ],
            architectureTip: 'Use Azure VM Scale Sets (VMSS) with Flexible Orchestration mode to mix Spot VMs (up to 90% discount) with standard on-demand VMs across availability zones.',
            examTip: 'Azure Container Instances (ACI) is fastest for isolated burst containers (no VM management). Azure Kubernetes Service (AKS) is for full container orchestration and service mesh.',
            scenarioStudy: 'Financial processing engine deploys a 50-node VMSS auto-scaling rule triggering when CPU utilization exceeds 75% for 5 consecutive minutes, automatically scaling down when below 25%.',
            cheatSheet: [
              'Bicep: Domain-specific language (DSL) for declarative Azure infrastructure as code (replaces verbose JSON ARM).',
              'Azure Bastion: Secure browser-based RDP/SSH directly over TLS without assigning public IPs to VMs.',
              'App Service Deployment Slots: Zero-downtime blue/green staging swaps with warmup verification.'
            ]
          },
          {
            id: 'az-104-mod-4',
            certId: 'az-104',
            title: 'Configure and Manage Virtual Networking & Monitoring',
            description: 'Configure VNets, subnets, NSGs, Azure Bastion, VPN Gateways, Application Gateways, and Azure Monitor alerts.',
            learnUrl: 'https://learn.microsoft.com/training/paths/az-104-manage-virtual-networks/',
            estimatedMinutes: 120,
            xp: 2200,
            prerequisites: ['az-104-mod-3'],
            order: 4,
            skillsCovered: ['VNet Peering', 'NSG Rules', 'Azure Bastion', 'Log Analytics & Alerts'],
            tasks: [
              { id: 'az104-4-1', title: 'Design hub-and-spoke VNet peering architecture', type: 'reading', durationMinutes: 40, completed: false },
              { id: 'az104-4-2', title: 'Hands-on Lab: Configure VNet Peering, NSG Security Rules & Routing', type: 'lab', durationMinutes: 55, completed: false },
              { id: 'az104-4-3', title: 'Final AZ-104 Comprehensive Practice Exam', type: 'knowledge_check', durationMinutes: 25, completed: false }
            ],
            architectureTip: 'Hub-and-Spoke Topology: Central hub VNet hosts shared services (Azure Firewall, VPN Gateway, Bastion); spoke VNets peer to hub with "Allow Gateway Transit" enabled.',
            examTip: 'NSG Rule Priority ranges 100-4096 (lower numbers evaluated first). Default rule "DenyAllInBound" priority 65500 catches everything unless earlier rule allows.',
            scenarioStudy: 'Global SaaS enterprise deploys Azure Application Gateway with WAF v2 for Layer 7 SSL termination and URL path-based routing (/api/* to backend API cluster, /* to React static storage).',
            cheatSheet: [
              'VNet Peering: Non-transitive by default (VNet A peered to B, and B to C does NOT allow A to talk to C without NVA routing).',
              'User Defined Routes (UDR): Custom route table to force traffic 0.0.0.0/0 to Next Hop: Virtual Appliance (Firewall).',
              'Azure Network Watcher: Connection Troubleshoot, IP Flow Verify, Packet Capture for packet-level debugging.'
            ]
          }
        ]
      },
      {
        id: 'az-305',
        domainId: 'cloud',
        code: 'AZ-305',
        title: 'Designing Microsoft Azure Infrastructure Solutions',
        level: 'Expert',
        icon: 'Crown',
        description: 'Design governance, compute, application architecture, storage, data integration, business continuity, and migration strategies.',
        learnUrl: 'https://learn.microsoft.com/credentials/certifications/azure-solutions-architect/',
        examUrl: 'https://learn.microsoft.com/credentials/certifications/exams/az-305/',
        totalXp: 9500,
        prerequisites: ['az-104'],
        color: '#107C41',
        modules: [
          {
            id: 'az-305-mod-1',
            certId: 'az-305',
            title: 'Design Governance, Identity and Security Architectures',
            description: 'Architect multi-tenant governance, landing zones, privileged access management, and Zero Trust cloud frameworks.',
            learnUrl: 'https://learn.microsoft.com/training/paths/design-identity-governance-monitor-solutions/',
            estimatedMinutes: 120,
            xp: 2400,
            prerequisites: ['az-104-mod-4'],
            order: 1,
            skillsCovered: ['Enterprise Landing Zones', 'Zero Trust', 'PIM & Conditional Access', 'Multi-tenant Governance'],
            tasks: [
              { id: 'az305-1-1', title: 'Evaluate Azure Landing Zone architectural patterns', type: 'reading', durationMinutes: 40, completed: false },
              { id: 'az305-1-2', title: 'Case Study: Architect secure zero-trust identity for multi-region corp', type: 'lab', durationMinutes: 50, completed: false },
              { id: 'az305-1-3', title: 'Governance & Security Architecture Check', type: 'knowledge_check', durationMinutes: 30, completed: false }
            ]
          },
          {
            id: 'az-305-mod-2',
            certId: 'az-305',
            title: 'Design Resilient Compute and Application Solutions',
            description: 'Architect microservices on Azure Kubernetes Service (AKS), Azure Container Apps, API Management, and event-driven patterns.',
            learnUrl: 'https://learn.microsoft.com/training/paths/design-business-continuity-solutions/',
            estimatedMinutes: 130,
            xp: 2600,
            prerequisites: ['az-305-mod-1'],
            order: 2,
            skillsCovered: ['AKS Microservices', 'Azure Service Bus', 'API Management', 'Event Grid'],
            tasks: [
              { id: 'az305-2-1', title: 'Design high-throughput event-driven messaging with Service Bus', type: 'reading', durationMinutes: 45, completed: false },
              { id: 'az305-2-2', title: 'Case Study: Architect 99.99% SLA microservices deployment', type: 'lab', durationMinutes: 60, completed: false },
              { id: 'az305-2-3', title: 'Compute & Application Design Check', type: 'knowledge_check', durationMinutes: 25, completed: false }
            ]
          },
          {
            id: 'az-305-mod-3',
            certId: 'az-305',
            title: 'Design Business Continuity, Disaster Recovery & Migration',
            description: 'Design Azure Site Recovery, geo-redundant backups, cross-region failover, RPO/RTO optimization, and Azure Migrate workflows.',
            learnUrl: 'https://learn.microsoft.com/training/paths/design-infrastructure-solutions/',
            estimatedMinutes: 140,
            xp: 2700,
            prerequisites: ['az-305-mod-2'],
            order: 3,
            skillsCovered: ['Azure Site Recovery', 'RPO/RTO Targets', 'Geo-replication', 'Azure Migrate Tooling'],
            tasks: [
              { id: 'az305-3-1', title: 'Formulate disaster recovery plans across paired Azure regions', type: 'reading', durationMinutes: 45, completed: false },
              { id: 'az305-3-2', title: 'Architecture Lab: Simulate failover recovery for tiered enterprise app', type: 'lab', durationMinutes: 65, completed: false },
              { id: 'az305-3-3', title: 'Final AZ-305 Solutions Architect Capstone Exam', type: 'knowledge_check', durationMinutes: 30, completed: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence & Machine Learning',
    tagline: 'Build cutting-edge Generative AI, OpenAI, Computer Vision, and NLP solutions',
    description: 'Progress from fundamental AI concepts to deploying enterprise Azure OpenAI, cognitive search, and custom ML pipelines.',
    accentColor: '#8E44AD', // Violet / AI purple
    badgeIcon: 'Brain',
    certifications: [
      {
        id: 'ai-900',
        domainId: 'ai',
        code: 'AI-900',
        title: 'Microsoft Azure AI Fundamentals',
        level: 'Fundamentals',
        icon: 'Bot',
        description: 'Fundamental principles of machine learning, computer vision, natural language processing, conversational AI, and Responsible AI.',
        learnUrl: 'https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/',
        examUrl: 'https://learn.microsoft.com/credentials/certifications/exams/ai-900/',
        totalXp: 4500,
        prerequisites: [],
        color: '#8E44AD',
        modules: [
          {
            id: 'ai-900-mod-1',
            certId: 'ai-900',
            title: 'Fundamental AI Concepts & Responsible AI',
            description: 'Learn core machine learning paradigms (regression, classification, clustering) and Microsoft Responsible AI pillars.',
            learnUrl: 'https://learn.microsoft.com/training/modules/get-started-ai-fundamentals/',
            estimatedMinutes: 40,
            xp: 850,
            prerequisites: [],
            order: 1,
            skillsCovered: ['Supervised Learning', 'Responsible AI Principles', 'AI Ethics & Fairness'],
            tasks: [
              { id: 'ai900-1-1', title: 'Explore Fairness, Inclusiveness, and Reliability in AI systems', type: 'reading', durationMinutes: 15, completed: false },
              { id: 'ai900-1-2', title: 'Identify regression vs classification prediction tasks', type: 'reading', durationMinutes: 15, completed: false },
              { id: 'ai900-1-3', title: 'AI Concepts Knowledge Check', type: 'knowledge_check', durationMinutes: 10, completed: false }
            ]
          },
          {
            id: 'ai-900-mod-2',
            certId: 'ai-900',
            title: 'Computer Vision & Natural Language Processing',
            description: 'Understand image classification, object detection, OCR, text analytics, sentiment analysis, and language understanding.',
            learnUrl: 'https://learn.microsoft.com/training/paths/explore-computer-vision-microsoft-azure/',
            estimatedMinutes: 55,
            xp: 1200,
            prerequisites: ['ai-900-mod-1'],
            order: 2,
            skillsCovered: ['Azure AI Vision', 'OCR & Document Intelligence', 'Sentiment Analysis', 'Language Translation'],
            tasks: [
              { id: 'ai900-2-1', title: 'Explore Azure AI Vision features and image tagging capabilities', type: 'reading', durationMinutes: 20, completed: false },
              { id: 'ai900-2-2', title: 'Hands-on Sandbox: Analyze images and extract text with OCR', type: 'lab', durationMinutes: 25, completed: false },
              { id: 'ai900-2-3', title: 'Vision & NLP Mastery Check', type: 'knowledge_check', durationMinutes: 10, completed: false }
            ]
          },
          {
            id: 'ai-900-mod-3',
            certId: 'ai-900',
            title: 'Generative AI & Azure OpenAI Fundamentals',
            description: 'Learn Large Language Models (LLMs), prompt engineering fundamentals, Copilot integrations, and diffusion image generation.',
            learnUrl: 'https://learn.microsoft.com/training/paths/explore-generative-ai-copilot-microsoft-azure/',
            estimatedMinutes: 60,
            xp: 1350,
            prerequisites: ['ai-900-mod-2'],
            order: 3,
            skillsCovered: ['Azure OpenAI Studio', 'Prompt Engineering', 'Microsoft Copilot Studio', 'DALL-E & GPT Models'],
            tasks: [
              { id: 'ai900-3-1', title: 'Study Transformer architecture basics and tokenization', type: 'reading', durationMinutes: 20, completed: false },
              { id: 'ai900-3-2', title: 'Interactive Lab: Prompt engineering in Azure AI Studio', type: 'lab', durationMinutes: 25, completed: false },
              { id: 'ai900-3-3', title: 'Final AI-900 Practice Assessment', type: 'knowledge_check', durationMinutes: 15, completed: false }
            ]
          }
        ]
      },
      {
        id: 'ai-102',
        domainId: 'ai',
        code: 'AI-102',
        title: 'Designing and Implementing Azure AI Solutions',
        level: 'Associate',
        icon: 'Cpu',
        description: 'Build, manage, and deploy AI solutions leveraging Azure AI Services, Azure OpenAI, Semantic Kernel, and RAG pipelines.',
        learnUrl: 'https://learn.microsoft.com/credentials/certifications/azure-ai-engineer/',
        examUrl: 'https://learn.microsoft.com/credentials/certifications/exams/ai-102/',
        totalXp: 8800,
        prerequisites: ['ai-900'],
        color: '#7D3C98',
        modules: [
          {
            id: 'ai-102-mod-1',
            certId: 'ai-102',
            title: 'Develop Enterprise Azure OpenAI & RAG Systems',
            description: 'Implement Retrieval-Augmented Generation (RAG) using Azure AI Search, vector embeddings, chunking, and semantic ranker.',
            learnUrl: 'https://learn.microsoft.com/training/paths/develop-generative-ai-solutions-azure-openai/',
            estimatedMinutes: 120,
            xp: 2500,
            prerequisites: ['ai-900-mod-3'],
            order: 1,
            skillsCovered: ['Vector Embeddings', 'Azure AI Search Hybrid Query', 'RAG Pattern', 'Semantic Kernel'],
            tasks: [
              { id: 'ai102-1-1', title: 'Vector search math and cosine similarity grounding', type: 'reading', durationMinutes: 30, completed: false },
              { id: 'ai102-1-2', title: 'Hands-on Lab: Build RAG bot with Azure OpenAI and Azure AI Search', type: 'lab', durationMinutes: 60, completed: false },
              { id: 'ai102-1-3', title: 'RAG Architecture Knowledge Check', type: 'knowledge_check', durationMinutes: 30, completed: false }
            ]
          },
          {
            id: 'ai-102-mod-2',
            certId: 'ai-102',
            title: 'Custom Vision, OCR & Document Intelligence',
            description: 'Train custom object detection models, Azure AI Document Intelligence form extractors, and facial recognition compliance.',
            learnUrl: 'https://learn.microsoft.com/training/paths/process-translate-speech-azure-ai-services/',
            estimatedMinutes: 100,
            xp: 2200,
            prerequisites: ['ai-102-mod-1'],
            order: 2,
            skillsCovered: ['Document Intelligence', 'Custom Vision API', 'Audio Translation', 'Whisper Model'],
            tasks: [
              { id: 'ai102-2-1', title: 'Train custom invoice layout extraction model', type: 'lab', durationMinutes: 45, completed: false },
              { id: 'ai102-2-2', title: 'Integrate real-time Azure Speech-to-Text streaming SDK', type: 'lab', durationMinutes: 35, completed: false },
              { id: 'ai102-2-3', title: 'Document & Speech AI Knowledge Check', type: 'knowledge_check', durationMinutes: 20, completed: false }
            ]
          },
          {
            id: 'ai-102-mod-3',
            certId: 'ai-102',
            title: 'Responsible AI, Content Safety & Fine-Tuning',
            description: 'Enforce Azure AI Content Safety filters, jailbreak detection, model fine-tuning with LoRA, and LLMOps evaluation metrics.',
            learnUrl: 'https://learn.microsoft.com/training/paths/manage-deploy-azure-ai-solutions/',
            estimatedMinutes: 110,
            xp: 2400,
            prerequisites: ['ai-102-mod-2'],
            order: 3,
            skillsCovered: ['AI Content Safety', 'Prompt Injection Defense', 'LLMOps & Evaluation', 'Model Fine-tuning'],
            tasks: [
              { id: 'ai102-3-1', title: 'Configure Content Safety thresholds and custom blocklists', type: 'reading', durationMinutes: 30, completed: false },
              { id: 'ai102-3-2', title: 'Lab: Run automated LLM evaluation with BLEU, ROUGE & groundness metrics', type: 'lab', durationMinutes: 55, completed: false },
              { id: 'ai102-3-3', title: 'Final AI-102 Certified AI Engineer Practice Exam', type: 'knowledge_check', durationMinutes: 25, completed: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'security',
    name: 'Cybersecurity & Compliance',
    tagline: 'Protect cloud infrastructure, identity perimeters, and incident response with Sentinel',
    description: 'Master Microsoft Defender, Microsoft Sentinel SIEM/SOAR, Microsoft Purview, and Entra ID security architectures.',
    accentColor: '#E74C3C', // Shield Red
    badgeIcon: 'ShieldCheck',
    certifications: [
      {
        id: 'sc-900',
        domainId: 'security',
        code: 'SC-900',
        title: 'Security, Compliance, and Identity Fundamentals',
        level: 'Fundamentals',
        icon: 'Shield',
        description: 'Demonstrate foundational knowledge of Microsoft Security, compliance, and identity solutions across cloud and hybrid environments.',
        learnUrl: 'https://learn.microsoft.com/credentials/certifications/security-compliance-and-identity-fundamentals/',
        examUrl: 'https://learn.microsoft.com/credentials/certifications/exams/sc-900/',
        totalXp: 4400,
        prerequisites: [],
        color: '#E74C3C',
        modules: [
          {
            id: 'sc-900-mod-1',
            certId: 'sc-900',
            title: 'Describe Security and Compliance Concepts',
            description: 'Understand Zero Trust methodology, shared responsibility, defense-in-depth, CIA triad, and compliance frameworks (ISO, SOC, NIST).',
            learnUrl: 'https://learn.microsoft.com/training/modules/describe-security-concepts-methodologies/',
            estimatedMinutes: 45,
            xp: 900,
            prerequisites: [],
            order: 1,
            skillsCovered: ['Zero Trust Principles', 'Defense in Depth', 'Threat Landscape'],
            tasks: [
              { id: 'sc900-1-1', title: 'Learn the three Zero Trust tenets: Verify explicitly, least privilege, assume breach', type: 'reading', durationMinutes: 15, completed: false },
              { id: 'sc900-1-2', title: 'Examine common attack vectors (phishing, ransomware, brute force)', type: 'reading', durationMinutes: 15, completed: false },
              { id: 'sc900-1-3', title: 'Security Concepts Check', type: 'knowledge_check', durationMinutes: 15, completed: false }
            ]
          },
          {
            id: 'sc-900-mod-2',
            certId: 'sc-900',
            title: 'Microsoft Entra Identity & Access Capabilities',
            description: 'Explore authentication methods, passwordless login, Entra ID Governance, PIM, and Conditional Access policies.',
            learnUrl: 'https://learn.microsoft.com/training/paths/describe-capabilities-of-microsoft-identity-and-access-management-solutions/',
            estimatedMinutes: 55,
            xp: 1150,
            prerequisites: ['sc-900-mod-1'],
            order: 2,
            skillsCovered: ['Conditional Access', 'Entra PIM', 'MFA & FIDO2', 'Identity Protection'],
            tasks: [
              { id: 'sc900-2-1', title: 'Configure Conditional Access signal-decision-enforcement loop', type: 'reading', durationMinutes: 20, completed: false },
              { id: 'sc900-2-2', title: 'Hands-on Lab: Configure Privileged Identity Management (PIM) just-in-time access', type: 'lab', durationMinutes: 25, completed: false },
              { id: 'sc900-2-3', title: 'Identity & Access Knowledge Check', type: 'knowledge_check', durationMinutes: 10, completed: false }
            ]
          },
          {
            id: 'sc-900-mod-3',
            certId: 'sc-900',
            title: 'Microsoft Security & Threat Protection Solutions',
            description: 'Overview of Microsoft Defender XDR suite, Microsoft Sentinel SIEM, and Microsoft Purview data governance.',
            learnUrl: 'https://learn.microsoft.com/training/paths/describe-capabilities-of-microsoft-security-solutions/',
            estimatedMinutes: 65,
            xp: 1400,
            prerequisites: ['sc-900-mod-2'],
            order: 3,
            skillsCovered: ['Defender for Cloud', 'Microsoft Sentinel', 'Microsoft Purview', 'Data Loss Prevention (DLP)'],
            tasks: [
              { id: 'sc900-3-1', title: 'Compare Defender for Endpoint vs Defender for Cloud', type: 'reading', durationMinutes: 25, completed: false },
              { id: 'sc900-3-2', title: 'Interactive Lab: Investigate incident alerts in Microsoft Defender portal', type: 'lab', durationMinutes: 25, completed: false },
              { id: 'sc900-3-3', title: 'Final SC-900 Practice Assessment', type: 'knowledge_check', durationMinutes: 15, completed: false }
            ]
          }
        ]
      },
      {
        id: 'sc-200',
        domainId: 'security',
        code: 'SC-200',
        title: 'Microsoft Security Operations Analyst',
        level: 'Associate',
        icon: 'Flame',
        description: 'Mitigate threats using Microsoft Defender for Endpoint, Microsoft Defender for Cloud, and Microsoft Sentinel.',
        learnUrl: 'https://learn.microsoft.com/credentials/certifications/security-operations-analyst/',
        examUrl: 'https://learn.microsoft.com/credentials/certifications/exams/sc-200/',
        totalXp: 8500,
        prerequisites: ['sc-900'],
        color: '#C0392B',
        modules: [
          {
            id: 'sc-200-mod-1',
            certId: 'sc-200',
            title: 'Mitigate Threats Using Microsoft Defender for Endpoint',
            description: 'Investigate alerts, perform device isolation, automate remediation playbooks, and analyze threat analytics.',
            learnUrl: 'https://learn.microsoft.com/training/paths/sc-200-mitigate-threats-using-microsoft-defender-for-endpoint/',
            estimatedMinutes: 100,
            xp: 2200,
            prerequisites: ['sc-900-mod-3'],
            order: 1,
            skillsCovered: ['Endpoint Detection & Response (EDR)', 'Automated Investigation', 'Live Response', 'Vulnerability Mgmt'],
            tasks: [
              { id: 'sc200-1-1', title: 'Investigate multi-stage attack story in Defender Portal', type: 'reading', durationMinutes: 30, completed: false },
              { id: 'sc200-1-2', title: 'Hands-on Lab: Execute Live Response shell on compromised host', type: 'lab', durationMinutes: 45, completed: false },
              { id: 'sc200-1-3', title: 'EDR Incident Analysis Check', type: 'knowledge_check', durationMinutes: 25, completed: false }
            ]
          },
          {
            id: 'sc-200-mod-2',
            certId: 'sc-200',
            title: 'Deploy and Configure Microsoft Sentinel SIEM/SOAR',
            description: 'Connect data connectors, write Kusto Query Language (KQL) rules, hunt threats, and trigger Logic Apps SOAR playbooks.',
            learnUrl: 'https://learn.microsoft.com/training/paths/sc-200-configure-microsoft-sentinel-environment/',
            estimatedMinutes: 130,
            xp: 2800,
            prerequisites: ['sc-200-mod-1'],
            order: 2,
            skillsCovered: ['KQL Queries', 'Sentinel Analytics Rules', 'SOAR Playbooks', 'Threat Intelligence Feeds'],
            tasks: [
              { id: 'sc200-2-1', title: 'Master KQL queries (where, summarize, project, render, join)', type: 'reading', durationMinutes: 40, completed: false },
              { id: 'sc200-2-2', title: 'Hands-on Lab: Build custom Sentinel detection rule & incident trigger', type: 'lab', durationMinutes: 60, completed: false },
              { id: 'sc200-2-3', title: 'Final SC-200 SecOps Practice Exam', type: 'knowledge_check', durationMinutes: 30, completed: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'data',
    name: 'Data Engineering & Analytics',
    tagline: 'Architect modern data lakes, Fabric analytics, synapse pipelines, and Delta Parquet engines',
    description: 'Comprehensive pathway for data professionals building streaming and batch big data pipelines on Microsoft Azure.',
    accentColor: '#27AE60', // Emerald Green
    badgeIcon: 'Database',
    certifications: [
      {
        id: 'dp-900',
        domainId: 'data',
        code: 'DP-900',
        title: 'Microsoft Azure Data Fundamentals',
        level: 'Fundamentals',
        icon: 'Layers',
        description: 'Core data concepts, relational data services (Azure SQL), non-relational services (Cosmos DB), and modern analytics.',
        learnUrl: 'https://learn.microsoft.com/credentials/certifications/azure-data-fundamentals/',
        examUrl: 'https://learn.microsoft.com/credentials/certifications/exams/dp-900/',
        totalXp: 4600,
        prerequisites: [],
        color: '#27AE60',
        modules: [
          {
            id: 'dp-900-mod-1',
            certId: 'dp-900',
            title: 'Core Data Concepts & Relational Databases in Azure',
            description: 'Relational data characteristics, normalization, SQL Server on Azure VMs, Azure SQL Database, and PostgreSQL.',
            learnUrl: 'https://learn.microsoft.com/training/modules/explore-core-data-concepts/',
            estimatedMinutes: 50,
            xp: 1000,
            prerequisites: [],
            order: 1,
            skillsCovered: ['Relational Data', 'Azure SQL Managed Instance', 'OLTP vs OLAP'],
            tasks: [
              { id: 'dp900-1-1', title: 'Explore ACID database properties and relational schemas', type: 'reading', durationMinutes: 20, completed: false },
              { id: 'dp900-1-2', title: 'Interactive Lab: Query Azure SQL database using Azure Data Studio', type: 'lab', durationMinutes: 20, completed: false },
              { id: 'dp900-1-3', title: 'Relational Data Knowledge Check', type: 'knowledge_check', durationMinutes: 10, completed: false }
            ]
          },
          {
            id: 'dp-900-mod-2',
            certId: 'dp-900',
            title: 'Non-Relational Data & Large-Scale Analytics',
            description: 'Explore Azure Cosmos DB multi-model APIs, Blob Storage data lakes, Azure Synapse Analytics, and Power BI reporting.',
            learnUrl: 'https://learn.microsoft.com/training/modules/explore-modern-data-warehouse-analytics/',
            estimatedMinutes: 60,
            xp: 1300,
            prerequisites: ['dp-900-mod-1'],
            order: 2,
            skillsCovered: ['Cosmos DB APIs', 'Data Lake Storage Gen2', 'Azure Synapse', 'Power BI'],
            tasks: [
              { id: 'dp900-2-1', title: 'Compare Document, Key-Value, Columnar, and Graph NoSQL databases', type: 'reading', durationMinutes: 20, completed: false },
              { id: 'dp900-2-2', title: 'Hands-on Lab: Create Cosmos DB container and run SQL API queries', type: 'lab', durationMinutes: 25, completed: false },
              { id: 'dp900-2-3', title: 'Final DP-900 Practice Check', type: 'knowledge_check', durationMinutes: 15, completed: false }
            ]
          }
        ]
      },
      {
        id: 'dp-203',
        domainId: 'data',
        code: 'DP-203',
        title: 'Data Engineering on Microsoft Azure',
        level: 'Associate',
        icon: 'Workflow',
        description: 'Design and implement data storage, data processing with Spark, Azure Data Factory ETL/ELT pipelines, and security.',
        learnUrl: 'https://learn.microsoft.com/credentials/certifications/azure-data-engineer/',
        examUrl: 'https://learn.microsoft.com/credentials/certifications/exams/dp-203/',
        totalXp: 8600,
        prerequisites: ['dp-900'],
        color: '#1E8449',
        modules: [
          {
            id: 'dp-203-mod-1',
            certId: 'dp-203',
            title: 'Design and Implement Data Storage & Medallion Architecture',
            description: 'Implement Delta Lake Bronze-Silver-Gold architecture, Partitioning, Parquet compression, and data lake security.',
            learnUrl: 'https://learn.microsoft.com/training/paths/design-implement-data-storage-azure/',
            estimatedMinutes: 110,
            xp: 2300,
            prerequisites: ['dp-900-mod-2'],
            order: 1,
            skillsCovered: ['Medallion Architecture', 'Delta Lake', 'Spark Partitioning', 'ADLS Gen2 ACLs'],
            tasks: [
              { id: 'dp203-1-1', title: 'Design optimal Delta Lake partitioning and Z-Ordering', type: 'reading', durationMinutes: 35, completed: false },
              { id: 'dp203-1-2', title: 'Hands-on Lab: Transform raw telemetry data into Gold reporting tables', type: 'lab', durationMinutes: 50, completed: false },
              { id: 'dp203-1-3', title: 'Data Storage Mastery Assessment', type: 'knowledge_check', durationMinutes: 25, completed: false }
            ]
          },
          {
            id: 'dp-203-mod-2',
            certId: 'dp-203',
            title: 'Orchestrate Data Pipelines with Azure Data Factory',
            description: 'Build automated CI/CD data ingestion pipelines, triggers, dynamic parameters, Mapping Data Flows, and Synapse Spark.',
            learnUrl: 'https://learn.microsoft.com/training/paths/integrate-data-azure-data-factory/',
            estimatedMinutes: 120,
            xp: 2600,
            prerequisites: ['dp-203-mod-1'],
            order: 2,
            skillsCovered: ['Azure Data Factory', 'Mapping Data Flows', 'Self-hosted Integration Runtime', 'Event Triggers'],
            tasks: [
              { id: 'dp203-2-1', title: 'Construct dynamic pipeline with parameters, variables, and lookup loops', type: 'lab', durationMinutes: 50, completed: false },
              { id: 'dp203-2-2', title: 'Lab: Configure incremental CDC loading using watermarking', type: 'lab', durationMinutes: 45, completed: false },
              { id: 'dp203-2-3', title: 'Final DP-203 Certified Data Engineer Exam', type: 'knowledge_check', durationMinutes: 25, completed: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Site Reliability',
    tagline: 'Implement CI/CD pipelines, GitOps, Infrastructure as Code, and automated testing',
    description: 'End-to-end DevOps practices on Azure DevOps and GitHub Actions for continuous deployment and observability.',
    accentColor: '#D35400', // Amber Bronze
    badgeIcon: 'GitBranch',
    certifications: [
      {
        id: 'az-400',
        domainId: 'devops',
        code: 'AZ-400',
        title: 'Designing and Implementing Microsoft DevOps Solutions',
        level: 'Expert',
        icon: 'Rocket',
        description: 'Integrate Git source control, Azure Pipelines, GitHub Actions, dependency management, security scanning, and SRE feedback loops.',
        learnUrl: 'https://learn.microsoft.com/credentials/certifications/devops-engineer/',
        examUrl: 'https://learn.microsoft.com/credentials/certifications/exams/az-400/',
        totalXp: 9100,
        prerequisites: ['az-104'],
        color: '#D35400',
        modules: [
          {
            id: 'az-400-mod-1',
            certId: 'az-400',
            title: 'Design and Implement Continuous Integration (CI)',
            description: 'Multi-stage YAML pipelines, container build caching, unit testing automation, SonarQube static analysis, and branch policies.',
            learnUrl: 'https://learn.microsoft.com/training/paths/az-400-implement-continuous-integration/',
            estimatedMinutes: 115,
            xp: 2400,
            prerequisites: ['az-104-mod-4'],
            order: 1,
            skillsCovered: ['GitHub Actions Workflows', 'Azure Pipelines YAML', 'Static Code Analysis', 'Container Registry Caching'],
            tasks: [
              { id: 'az400-1-1', title: 'Write secure GitHub Actions workflow with OIDC federated credentials', type: 'reading', durationMinutes: 35, completed: false },
              { id: 'az400-1-2', title: 'Hands-on Lab: Build automated CI pipeline with test coverage gates', type: 'lab', durationMinutes: 55, completed: false },
              { id: 'az400-1-3', title: 'CI Practices Knowledge Check', type: 'knowledge_check', durationMinutes: 25, completed: false }
            ]
          },
          {
            id: 'az-400-mod-2',
            certId: 'az-400',
            title: 'Design and Implement Continuous Delivery & Infrastructure as Code (CD & IaC)',
            description: 'Blue-green and canary deployments, Terraform & Bicep automated testing, feature flags with App Configuration, and Chaos Studio.',
            learnUrl: 'https://learn.microsoft.com/training/paths/az-400-implement-continuous-delivery/',
            estimatedMinutes: 130,
            xp: 2800,
            prerequisites: ['az-400-mod-1'],
            order: 2,
            skillsCovered: ['Blue-Green Deployments', 'Canary Rollouts', 'Terraform CI/CD', 'Azure Chaos Studio'],
            tasks: [
              { id: 'az400-2-1', title: 'Configure progressive canary deployment with traffic routing rules', type: 'reading', durationMinutes: 40, completed: false },
              { id: 'az400-2-2', title: 'Lab: Automated Bicep deployment pipeline with pre-flight validation', type: 'lab', durationMinutes: 60, completed: false },
              { id: 'az400-2-3', title: 'Final AZ-400 DevOps Master Exam', type: 'knowledge_check', durationMinutes: 30, completed: false }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_USER_PROGRESS = {
  completedModuleIds: ['az-900-mod-1'],
  completedCertIds: [],
  completedTaskIds: ['az900-1-1', 'az900-1-2'],
  customTasks: [
    {
      id: 'custom-task-1',
      certId: 'az-900',
      moduleId: 'az-900-mod-2',
      title: 'Practice with Azure CLI az vm create commands in Sandbox',
      completed: false,
      priority: 'high' as const,
      dueDate: 'Tomorrow',
      createdAt: new Date().toISOString(),
      notes: 'Need to review region availability for D2s_v3'
    },
    {
      id: 'custom-task-2',
      certId: 'ai-900',
      moduleId: 'ai-900-mod-1',
      title: 'Review Microsoft Responsible AI Transparency Notes',
      completed: true,
      priority: 'medium' as const,
      createdAt: new Date().toISOString()
    }
  ],
  moduleNotes: {
    'az-900-mod-1': 'Remember: Cloud elasticity = auto-scaling based on real-time metrics; Cloud agility = speed of provisioning resources.'
  },
  totalXp: 900,
  totalTimeMinutes: 45,
  studyStreakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  achievements: ['first_step', 'cloud_explorer'],
  quizAttempts: [
    {
      id: 'quiz-init-attempt-1',
      moduleId: 'az-900-mod-2',
      moduleTitle: 'Azure Architecture, Regions & Compute Services',
      certId: 'az-900',
      certCode: 'AZ-900',
      score: 1,
      totalQuestions: 3,
      passed: false,
      timestamp: new Date(Date.now() - 3600000 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      skillsCovered: ['Regions & AZs', 'Virtual Machines', 'Azure App Service', 'Serverless Functions'],
      missedTopics: [
        {
          question: 'What is the primary difference between Azure Availability Zones and Azure Region Pairs?',
          userAnswer: 'Availability Zones are located at least 300 miles apart in different countries.',
          correctAnswer: 'Availability Zones are physically separate datacenters within the SAME Azure region; Region Pairs are separate regions >= 300 miles apart.',
          explanation: 'Availability Zones protect against single datacenter power/cooling failures within a region with <2ms latency fiber.'
        },
        {
          question: 'Which Azure compute option provides event-driven serverless code execution without provisioning infrastructure?',
          userAnswer: 'Azure Virtual Machine Scale Sets',
          correctAnswer: 'Azure Functions',
          explanation: 'Azure Functions is the serverless compute engine in Microsoft Azure that scales dynamically per event trigger.'
        }
      ]
    }
  ],
  strugglingModuleIds: ['az-900-mod-2'],
};

export const INITIAL_USER_PROFILE = {
  name: 'Learner',
  email: '',
  accountType: 'Personal Microsoft Account' as const,
  organization: '',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  roleTitle: 'Cloud & AI Learner',
  isSignedIn: false,
  microsoftTenant: 'Microsoft Identity Platform'
};
