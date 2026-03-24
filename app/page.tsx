import SearchBar from "@/components/search/SearchBar";
import { Search, Users, BookMarked } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center gap-4 pt-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Find Your Next <span className="text-blue-600">Lead</span>
        </h1>
        <p className="text-gray-500 text-xl max-w-2xl">
          Search for businesses in any area, enrich them with contact details
          and build your outreach pipeline with Outreach IQ.
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <SearchBar />
      </div>

      {/* Feature Cards */}
      <div className="grid frid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Search className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Find Businesses</h3>
          <p className="text-gray-500 text-sm">
            Search for businesses by keyword, category and location using
            Google Places.
          </p>
        </div>
        <div className="flex flex-col gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Enrich Contacts</h3>
          <p className="text-gray-500 text-sm">
            Automatically find contact names, titles and email addresses for
            each business.
          </p>
        </div>
        <div className="flex flex-col gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex h-10 w-10 items-centerjustify-center rounded-lg bg-blue-50">
            <BookMarked className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Save Leads</h3>
          <p className="text-gray-500 text-sm">
            Save your best leadsto your pipeline and manage them from your
            saved leads dashboard.
          </p>
        </div>
      </div>
      
    </div>
  );
}