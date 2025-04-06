export const dashboardStatsCardData = ({ role }) => {
  return [
    {
      roleCondition: role != "author",
      bgColor: "#EFFFE2",
      iconBgColor: "#C0FD8E",
      iconColor: "#000000",
      title: "Platform Earnings",
      value: "₹4,360",
    },
    {
      roleCondition: true,
      bgColor: "#FFE8E2",
      iconBgColor: "#FA5A7D",
      iconColor: "#ffffff",
      title: "Total Royalty",
      value: "₹4,360",
    },
    {
      roleCondition: true,
      bgColor: "#FFE5F9",
      iconBgColor: "#FE7AE1",
      iconColor: "#ffffff",
      title: "Total Books",
      value: "300",
    },
    {
      roleCondition: true,
      bgColor: "#E5E6FF",
      iconBgColor: "#5D60EF",
      iconColor: "#ffffff",
      title: "Total Sale",
      value: "100",
    },
    {
      roleCondition: role != "author",
      bgColor: "#FFF7E5",
      iconBgColor: "#FFB612",
      iconColor: "#ffffff",
      title: "Total Authors",
      value: "100",
    },
  ];
};
