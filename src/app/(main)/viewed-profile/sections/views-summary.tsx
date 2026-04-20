import ProfileAnalytics from "@/components/ProfileAnalytics.tsx/ProfileAnalytics";

const data = {
  totalViews: 12345,
  uniqueViewers: 1234,
  mostActiveCity: "New York",
  viewsThisWeek: 344,
};

export default function ViewsSummary() {
  return (
    <div>
      <ProfileAnalytics data={data} />
    </div>
  );
}
