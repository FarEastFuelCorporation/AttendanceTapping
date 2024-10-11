import { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../../../theme";
import { useTheme } from "@emotion/react";

const PieChart = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDepartmentCounts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/hrDashboard/employee`);
        const data = await response.json();

        const departmentCounts = data.departmentCounts; // Assuming departmentCounts is directly in response.data

        // Convert the departmentCounts to the format required by the pie chart
        const formattedData = Object.keys(departmentCounts).map((key) => ({
          id: key.replace(" DEPARTMENT", ""),
          label: key.replace(" DEPARTMENT", ""),
          value: departmentCounts[key],
          color: "hsl(210, 70%, 50%)", // You can set a default color or customize as needed
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching department counts:", error);
      }
    };

    fetchDepartmentCounts();
  }, [apiUrl]);

  return (
    <ResponsivePie
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
          legendOffset: 10,
        },
      ]}
    />
  );
};

export default PieChart;
