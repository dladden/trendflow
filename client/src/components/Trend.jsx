import React from 'react';
import { TrendLarge, TrendSmall } from '../components';
import Container from '../assets/wrappers/TrendContainer'; //general layout, color and loading
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
/**
 * This component is used by Trends.jsx to display each trend in a trend card with its detail like the chart, trend name etc.
 * This component uses: TrendChartComponent, TrendChart, TrendFlashChart,
 * @param {Object[]} interestOverTime - is set up as keyValueObject {{key: string, value: number}} used in recharts
 * @param {string} trend - trend name
 * @param {string} trendCategory - trend category
 * @param {string} trendTech - the technology used in the trend
 * @param {string} trendDesc - data for storing short description
 * @param {Object[]} createdBy - mongoose.Types.ObjectId user id who added the trend
 * @param {string} slug - string for url link
 * @param {number} views - counts each visit to the trend in incrementViews()
 * @param {boolean} isApproved - if trend succeeds in generating all data this marked as true
 * @param {Date} createdAt - generated by mongodb ex: 2024-01-06T05:00:00.000+00:00
 * @param {Date} updatedAt - generated every time there is update in Model ex: 2024-01-06T05:00:00.000+00:00
 * @param {Object[]} flashChart - set up as keyValueObject {{ value: number}}
 * @param {Object[]} forecast - is set up as keyValueObject {{key: string, value: number}} used in recharts
 * @param {string} generatedBlog - large string with HTML structured data
 * @param {string} trendStatus - trend status based on data
 * @param {string} trendUse - string with more HTML structured data
 * @returns {JSX.Element} The TrendCard component populated with the trend data and chart.
 * @param {string[]} savedTrends is array which is extracted from user object and saved with onSave to db
 * @param {func} onSave - use to track when user clicks bookmark button and does a PATCH
 * @param {boolean} isGridView - this is used to determine if grid-view is used in smaller screens
 * @param {string[]} onRemove - PATCH Delete (only for admin)
 * @param {string[]}
 * @param {string[]}
 * @param {string[]}
 *
 */
function Trend({
  interestOverTime,
  views,
  trendStatus,
  isAdminPage,
  flashChart,
  onApprove,
  onSave,
  onRemove,
  savedTrends,
  techIconUrl,
  cateIconUrl,
  onDelete,
  createdAt,
  createdBy,
  isApproved,
  slug,
  trend,
  trendCategory,
  trendDesc,
  trendTech,
  _id,
  updatedAt,
  loadingSlug,
  isGridView,
  isLargeTrendView,
  githubUsername,
  chartHeight,
  chartMarginTop,
  chartMarginBottom,
}) {
  const upDate = day(updatedAt).format('MM YYYY'); //converting updated at
  const isLoading = loadingSlug === slug; // determining if this specific trend is loading
  const isLargeScreen = window.matchMedia('(min-width: 812px)').matches; // using media query hook to determine the screen size
  // Props for TrendLarge
  const largeProps = {
    _id,
    slug,
    views,
    trend,
    trendTech,
    trendStatus,
    trendCategory,
    trendDesc,
    isLoading,
    upDate,
    interestOverTime,
    isAdminPage,
    onApprove,
    onDelete,
    onSave,
    onRemove,
    savedTrends,
    techIconUrl,
    cateIconUrl,
    createdAt,
    createdBy,
    isApproved,
    githubUsername,
  };
  // Props for TrendSmall
  const smallProps = {
    _id,
    trend,
    views,
    trendTech,
    trendCategory,
    slug,
    upDate,
    onSave,
    onRemove,
    savedTrends,
    techIconUrl,
    flashChart,
    updatedAt,
    isLoading,
    isApproved,
    isAdminPage,
    createdBy,
    onApprove,
    isGridView,
    trendDesc,
    githubUsername,
    chartHeight,
    chartMarginTop,
    chartMarginBottom,
  };

  return (
    <Container>
      {isLargeScreen ? (
        isLargeTrendView ? (
          <TrendLarge {...largeProps} />
        ) : (
          <TrendSmall {...smallProps} />
        )
      ) : isLargeTrendView ? (
        <TrendLarge {...largeProps} />
      ) : isGridView ? (
        <TrendSmall {...smallProps} />
      ) : (
        <TrendSmall {...smallProps} />
      )}
    </Container>
  );
}

export default Trend;
