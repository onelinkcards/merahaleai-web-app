import { Calendar, ChevronDown, MapPin, Play, Search, Star, Users } from "lucide-react";
import Link from "next/link";

const eventTypes = [
  {
    id: 1,
    name: "Wedding",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Birthday",
    image:
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Corporate",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Satsang",
    image:
      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Anniversary",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "House Party",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Engagement",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Festival",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80&auto=format&fit=crop",
  },
];

const vendors = [
  {
    id: 1,
    name: "Sharma Royal Caterers",
    location: "C-Scheme, Jaipur",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
    rating: "4.9",
    reviews: "248 reviews",
    badge: "Veg",
    cuisine: "Rajasthani • North Indian",
    packages: ["Bronze ₹300", "Silver ₹450", "Gold ₹650"],
  },
  {
    id: 2,
    name: "Kesar Courtyard Kitchens",
    location: "Vaishali Nagar, Jaipur",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&q=80&auto=format&fit=crop",
    rating: "4.8",
    reviews: "211 reviews",
    badge: "Veg / Non-veg",
    cuisine: "Mughlai • Rajasthani",
    packages: ["Bronze ₹320", "Silver ₹470", "Gold ₹690"],
  },
  {
    id: 3,
    name: "Jaipur Feast Collective",
    location: "Malviya Nagar, Jaipur",
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80&auto=format&fit=crop",
    rating: "4.8",
    reviews: "193 reviews",
    badge: "Veg",
    cuisine: "Punjabi • South Indian",
    packages: ["Bronze ₹280", "Silver ₹430", "Gold ₹620"],
  },
  {
    id: 4,
    name: "Heritage Halwai Studio",
    location: "Mansarovar, Jaipur",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=80&auto=format&fit=crop",
    rating: "4.9",
    reviews: "276 reviews",
    badge: "Veg / Non-veg",
    cuisine: "Traditional • Premium Sweets",
    packages: ["Bronze ₹340", "Silver ₹490", "Gold ₹710"],
  },
];

const cuisineGrid = [
  {
    id: 1,
    name: "Rajasthani",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Mughlai",
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107aa65c46?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Punjabi",
    image:
      "https://images.unsplash.com/photo-1604908176997-43122f1b4973?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "South Indian",
    image:
      "https://images.unsplash.com/photo-1630383249896-424e482df921?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Tea Party",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Live BBQ",
    image:
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=900&q=80&auto=format&fit=crop",
  },
];

const reelStories = [
  {
    id: 1,
    name: "Ananya Sharma",
    event: "Wedding Reception",
    quote:
      "The food quality, live counters, and service flow were beyond expectations.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Raghav Mehta",
    event: "Corporate Annual Meet",
    quote: "Transparent rates and a polished team. Booking was smooth from start to finish.",
    image:
      "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Priya & Kunal",
    event: "Engagement Ceremony",
    quote:
      "Our guests loved every dish. The custom menu option made all the difference.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&q=80&auto=format&fit=crop",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#FFFAF5] text-[#804226]">
      <header className="fixed top-0 z-50 w-full border-b border-[#E8D5B7] bg-[#FFFFFF]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="text-lg font-bold text-[#804226]">MeraHalwai</div>
          <nav className="hidden items-center gap-6 md:flex">
            <button className="text-sm font-medium text-[#804226] transition-opacity hover:opacity-75">
              Caterers
            </button>
            <button className="text-sm font-medium text-[#804226] transition-opacity hover:opacity-75">
              Events
            </button>
            <button className="text-sm font-medium text-[#804226] transition-opacity hover:opacity-75">
              How it works
            </button>
          </nav>
          <Link
            href="/caterers"
            className="rounded-xl bg-[#DE903E] px-4 py-2 text-sm font-semibold text-[#FFFFFF] transition-colors hover:bg-[#804226]"
          >
            Book Now
          </Link>
        </div>
      </header>

      <section className="px-4 pb-16 pt-16 lg:px-8">
        <div
          className="relative min-h-[600px] overflow-hidden rounded-3xl lg:min-h-[700px]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?w=2400&q=80&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#804226]/75 via-[#804226]/40 to-[#804226]/55" />
          <div className="relative mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-center px-4 pb-36 text-center lg:min-h-[700px]">
            <p className="rounded-full border border-[#FFFFFF]/40 bg-[#FFFFFF]/15 px-5 py-2 text-sm font-semibold text-[#FFFFFF]">
              Jaipur&apos;s Most Loved Catering Marketplace
            </p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[1.1] tracking-tight text-[#FFFFFF] lg:text-7xl">
              Book Jaipur&apos;s Best Halwais. Instantly.
            </h1>
            <p className="mt-5 max-w-3xl text-base text-[#FFFFFF] lg:text-lg">
              Rich menus, verified kitchens, and seamless event catering from intimate
              gatherings to grand weddings.
            </p>
          </div>
        </div>

        <div className="relative z-20 mx-auto -mt-16 w-full max-w-5xl">
          <div className="flex w-full flex-col gap-2 rounded-3xl border border-[#E8D5B7] bg-[#FFFFFF] p-2 shadow-[0_18px_45px_rgb(128,66,38,0.22)] lg:flex-row lg:items-center lg:gap-0 lg:rounded-full lg:p-3">
            <button className="flex h-14 flex-1 items-center justify-between rounded-full px-5 text-left transition-colors hover:bg-[#FFFAF5]">
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#8B7355]">
                  Event
                </span>
                <span className="mt-1 block text-base font-semibold text-[#804226]">
                  Wedding Celebration
                </span>
              </span>
              <ChevronDown className="h-5 w-5 text-[#8B7355]" />
            </button>
            <div className="hidden h-10 w-px bg-[#E8D5B7] lg:block" />
            <button className="flex h-14 flex-1 items-center justify-between rounded-full px-5 text-left transition-colors hover:bg-[#FFFAF5]">
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#8B7355]">
                  Date
                </span>
                <span className="mt-1 block text-base font-semibold text-[#804226]">
                  Select Date
                </span>
              </span>
              <Calendar className="h-5 w-5 text-[#8B7355]" />
            </button>
            <div className="hidden h-10 w-px bg-[#E8D5B7] lg:block" />
            <button className="flex h-14 flex-1 items-center justify-between rounded-full px-5 text-left transition-colors hover:bg-[#FFFAF5]">
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#8B7355]">
                  Guests
                </span>
                <span className="mt-1 block text-base font-semibold text-[#804226]">
                  150 - 350 Guests
                </span>
              </span>
              <Users className="h-5 w-5 text-[#8B7355]" />
            </button>
            <Link
              href="/caterers"
              className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#DE903E] px-8 text-base font-bold text-[#FFFFFF] transition-colors hover:bg-[#804226]"
            >
              <Search className="h-5 w-5" />
              Search Caterers
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#FFFFFF] py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight text-[#804226] lg:text-4xl">
              Browse by Event Type
            </h2>
            <button className="text-sm font-semibold text-[#804226]">View All</button>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-5 pr-4">
              {eventTypes.map((event) => (
                <div key={event.id} className="group flex w-[120px] flex-col items-center lg:w-[150px]">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#FFFFFF] shadow-[0_8px_20px_rgb(128,66,38,0.18)] lg:h-32 lg:w-32">
                    <img src={event.image} alt={event.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <p className="mt-3 text-center text-sm font-bold text-[#804226] lg:text-base">
                    {event.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFFAF5] py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[#804226] lg:text-4xl">
                Trending Halwais
              </h2>
              <p className="mt-2 text-sm text-[#8B7355] lg:text-base">
                Most booked vendors this month with premium food quality.
              </p>
            </div>
            <button className="hidden text-sm font-semibold text-[#804226] lg:block">
              See More
            </button>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {vendors.map((vendor) => (
              <article
                key={vendor.id}
                className="overflow-hidden rounded-3xl border border-[#E8D5B7] bg-[#FFFFFF] shadow-[0_10px_30px_rgb(128,66,38,0.12)]"
              >
                <div
                  className="relative h-[220px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgba(30,30,30,0.78), rgba(30,30,30,0.12)), url('" +
                      vendor.image +
                      "')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute left-4 top-4 rounded-full bg-[#FFFFFF] px-3 py-1 text-xs font-bold text-[#804226]">
                    {vendor.badge}
                  </div>
                  <div className="absolute right-4 top-4 rounded-full bg-[#804226] px-3 py-1 text-xs font-semibold text-[#FFFFFF]">
                    MH Verified
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[#FFFFFF]">
                    <Star className="h-4 w-4 fill-[#DE903E] text-[#DE903E]" />
                    <span className="text-sm font-semibold">{vendor.rating}</span>
                    <span className="text-sm">{vendor.reviews}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold tracking-tight text-[#804226]">
                    {vendor.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-[#8B7355]">
                    <MapPin className="h-4 w-4" />
                    {vendor.location}
                  </p>
                  <p className="mt-2 text-sm text-[#8B7355]">{vendor.cuisine}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {vendor.packages.map((pkg) => (
                      <span
                        key={pkg}
                        className="rounded-full bg-[#FFFAF5] px-3 py-1 text-xs font-semibold text-[#804226] ring-1 ring-[#E8D5B7]"
                      >
                        {pkg}
                      </span>
                    ))}
                  </div>
                  <button className="mt-5 w-full rounded-xl bg-[#DE903E] px-4 py-3 text-sm font-bold text-[#FFFFFF] transition-colors hover:bg-[#804226]">
                    View Menu & Availability
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div
          className="mx-auto w-full max-w-7xl rounded-3xl px-6 py-14 text-center lg:px-10 lg:py-16"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(128,66,38,0.92), rgba(128,66,38,0.85)), url('https://images.unsplash.com/photo-1555244162-803834f70033?w=2200&q=80&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="text-3xl font-black tracking-tight text-[#FFFFFF] lg:text-4xl">
            Want a completely custom menu for a special theme?
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-[#FFFFFF] lg:text-base">
            Build your own package with signature dishes, live counters, and sweet stations
            tailored to your event vibe.
          </p>
          <button className="mt-7 rounded-full bg-[#DE903E] px-8 py-4 text-sm font-bold text-[#FFFFFF] transition-colors hover:bg-[#FFFFFF] hover:text-[#804226]">
            Create Your Own Custom Package
          </button>
        </div>
      </section>

      <section className="bg-[#FFFFFF] py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-[#804226] lg:text-4xl">
            Browse by Cuisine
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cuisineGrid.map((item) => (
              <article
                key={item.id}
                className="group relative h-48 overflow-hidden rounded-2xl border border-[#E8D5B7] lg:h-56"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#804226]/78 to-[#804226]/10" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-xl font-bold tracking-tight text-[#FFFFFF]">{item.name}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFFAF5] py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-[#804226] lg:text-4xl">
            Real Stories
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[#8B7355] lg:text-base">
            Hear directly from hosts who booked through MeraHalwai.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {reelStories.map((story) => (
              <article
                key={story.id}
                className="group relative h-[420px] overflow-hidden rounded-3xl border border-[#E8D5B7] shadow-[0_10px_30px_rgb(128,66,38,0.14)]"
              >
                <img
                  src={story.image}
                  alt={story.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/85 via-[#1E1E1E]/20 to-[#1E1E1E]/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFFFFF]/85 text-[#804226] transition-transform duration-300 group-hover:scale-105">
                    <Play className="ml-1 h-7 w-7 fill-[#804226] text-[#804226]" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-sm leading-relaxed text-[#FFFFFF]">{story.quote}</p>
                  <p className="mt-3 text-base font-bold text-[#FFFFFF]">{story.name}</p>
                  <p className="text-sm text-[#E8D5B7]">{story.event}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E8D5B7] bg-[#FFFFFF] py-14">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-xl font-bold text-[#804226]">MeraHalwai</p>
            <p className="mt-3 text-sm leading-relaxed text-[#8B7355]">
              Jaipur&apos;s image-first premium catering marketplace for unforgettable events.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#804226]">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-[#8B7355]">
              <li>About</li>
              <li>How It Works</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#804226]">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-[#8B7355]">
              <li>Help Center</li>
              <li>Terms</li>
              <li>Privacy</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#804226]">Partners</p>
            <ul className="mt-3 space-y-2 text-sm text-[#8B7355]">
              <li>Partner with us</li>
              <li>Vendor Guidelines</li>
              <li>City Expansion</li>
              <li>Corporate Events</li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
