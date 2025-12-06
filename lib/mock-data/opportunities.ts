import { Opportunity } from "@/lib/types";

export const MOCK_OPPORTUNITIES: Opportunity[] = [
    // --- Summer Programs ---
    {
        id: "op-1",
        title: "MIT Research Science Institute (RSI)",
        description: "A prestigious, cost-free summer science & engineering program for high school students. Participants conduct individual research projects under the mentorship of experienced scientists and researchers.",
        image_url: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=800",
        link: "https://www.cee.org/programs/rsi",
        type: "Summer Program",
        location: "Cambridge, MA",
        start_date: "2024-06-23",
        end_date: "2024-08-03",
        eligibility: {
            grade: "11th",
            cost: "Free",
            deadline: "2024-01-15",
            difficulty: "Very High"
        }
    },
    {
        id: "op-2",
        title: "Stanford University Mathematics Camp (SUMaC)",
        description: "An intensive four-week academic program for exceptional high school students who have a passion for mathematics. Explore advanced topics in number theory and abstract algebra.",
        image_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800",
        link: "https://sumac.stanford.edu/",
        type: "Summer Program",
        location: "Stanford, CA",
        start_date: "2024-06-17",
        end_date: "2024-07-12",
        eligibility: {
            grade: "10th-11th",
            cost: "$8,250 (Aid available)",
            deadline: "2024-02-01",
            difficulty: "High"
        }
    },
    {
        id: "op-3",
        title: "LaunchX Entrepreneurship Program",
        description: "Launch a real startup in 4 weeks. Work in teams to build a viable product and pitch to investors. Learn from industry experts and join a global network of young entrepreneurs.",
        image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
        link: "https://launchx.com/",
        type: "Summer Program",
        location: "Ann Arbor, MI / Online",
        start_date: "2024-06-30",
        end_date: "2024-07-27",
        eligibility: {
            grade: "9th-12th",
            cost: "$5,980 - $9,450",
            deadline: "2024-02-15",
            difficulty: "Medium"
        }
    },

    // --- Internships ---
    {
        id: "op-4",
        title: "NASA High School Internship",
        description: "Contribute to agency projects under the guidance of a NASA mentor. Opportunities available in engineering, science, technology, and administrative fields at various NASA centers.",
        image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        link: "https://intern.nasa.gov/",
        type: "Internship",
        location: "Various Locations / Remote",
        start_date: "2024-06-10",
        end_date: "2024-08-16",
        eligibility: {
            grade: "10th-12th (16+)",
            cost: "Paid (Stipend)",
            deadline: "2024-03-01",
            difficulty: "High"
        }
    },
    {
        id: "op-5",
        title: "Google Computer Science Summer Institute (CSSI)",
        description: "A 3-week introduction to computer science for graduating high school seniors with a passion for technology. Designed to increase the number of women and underrepresented students in CS.",
        image_url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
        link: "https://buildyourfuture.withgoogle.com/programs/cssi",
        type: "Internship",
        location: "Multiple Locations / Online",
        start_date: "2024-07-08",
        end_date: "2024-07-26",
        eligibility: {
            grade: "12th (Graduating)",
            cost: "Free + Stipend",
            deadline: "2024-03-20",
            difficulty: "Medium"
        }
    },
    {
        id: "op-6",
        title: "Bank of America Student Leaders",
        description: "An eight-week paid summer internship with a local nonprofit organization and a week-long Student Leaders Summit in Washington, D.C. Focuses on community service and leadership.",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
        link: "https://about.bankofamerica.com/en/making-an-impact/student-leaders",
        type: "Internship",
        location: "Local Community",
        start_date: "2024-06-15",
        end_date: "2024-08-09",
        eligibility: {
            grade: "11th-12th",
            cost: "Paid",
            deadline: "2024-01-17",
            difficulty: "Medium"
        }
    },

    // --- Competitions ---
    {
        id: "op-7",
        title: "Regeneron Science Talent Search",
        description: "The nation's oldest and most prestigious science and math competition for high school seniors. Finalists compete for over $3 million in awards in Washington, D.C.",
        image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
        link: "https://www.societyforscience.org/regeneron-sts/",
        type: "Competition",
        location: "Washington, D.C.",
        start_date: "2024-01-01",
        end_date: "2024-03-13",
        eligibility: {
            grade: "12th",
            cost: "Free",
            deadline: "2023-11-08",
            difficulty: "Very High"
        }
    },
    {
        id: "op-8",
        title: "Scholastic Art & Writing Awards",
        description: "The nation's longest-running and most prestigious recognition program for creative teens in grades 7–12. Categories include architecture, painting, poetry, photography, and video game design.",
        image_url: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800",
        link: "https://www.artandwriting.org/",
        type: "Competition",
        location: "National / Regional",
        start_date: "2023-09-01",
        end_date: "2024-06-01",
        eligibility: {
            grade: "7th-12th",
            cost: "$10 per entry (Waivers available)",
            deadline: "2023-12-01",
            difficulty: "Medium"
        }
    },
    {
        id: "op-9",
        title: "Congressional App Challenge",
        description: "A competition to encourage students to learn to code and inspire them to pursue careers in computer science. Students create and submit their own original apps.",
        image_url: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800",
        link: "https://www.congressionalappchallenge.us/",
        type: "Competition",
        location: "District-based",
        start_date: "2024-06-15",
        end_date: "2024-11-01",
        eligibility: {
            grade: "6th-12th",
            cost: "Free",
            deadline: "2024-11-01",
            difficulty: "Low"
        }
    },

    // --- Volunteering / Other ---
    {
        id: "op-10",
        title: "Habitat for Humanity Youth Program",
        description: "Volunteer to help build simple, decent, and affordable housing. Join a local build site or participate in a Global Village trip to build homes around the world.",
        image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
        link: "https://www.habitat.org/volunteer/near-you/youth-programs",
        type: "Volunteering",
        location: "Global",
        start_date: "Flexible",
        end_date: "Flexible",
        eligibility: {
            grade: "Any (Age 16+ for construction)",
            cost: "Free (Travel costs for Global Village)",
            deadline: "Rolling",
            difficulty: "Low"
        }
    },
    {
        id: "op-11",
        title: "United Nations Youth Delegate Program",
        description: "Serve as a representative of your country's youth at the United Nations. Participate in intergovernmental meetings and advocate for youth issues on a global stage.",
        image_url: "https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?auto=format&fit=crop&q=80&w=800",
        link: "https://www.un.org/en/youth-delegate-program/",
        type: "Volunteering",
        location: "New York, NY",
        start_date: "2024-09-01",
        end_date: "2025-09-01",
        eligibility: {
            grade: "18-24 years old",
            cost: "Varies by country",
            deadline: "Varies",
            difficulty: "Very High"
        }
    },
    {
        id: "op-12",
        title: "Harvard Pre-College Program",
        description: "A two-week residential program for rising juniors and seniors. Experience college life at Harvard, take non-credit courses, and meet students from around the world.",
        image_url: "https://images.unsplash.com/photo-1559135197-8a45ea74d367?auto=format&fit=crop&q=80&w=800",
        link: "https://summer.harvard.edu/high-school-programs/pre-college-program/",
        type: "Summer Program",
        location: "Cambridge, MA",
        start_date: "2024-06-23",
        end_date: "2024-07-05",
        eligibility: {
            grade: "11th-12th",
            cost: "$5,550",
            deadline: "2024-01-24",
            difficulty: "Medium"
        }
    }
];
