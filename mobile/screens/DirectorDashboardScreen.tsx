import { View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors, Colors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

const quickActions = [
  { label: 'Send Broadcast', icon: 'volume-2' },
  { label: 'Launch Drill', icon: 'activity' },
  { label: 'Open Board Review', icon: 'trello' },
];

const branchComparisons = [
  { title: 'Hawassa Campus', attendance: '95%', trend: '+4.2%', color: '#10B981' },
  { title: 'Lalibela STEM', attendance: '82%', trend: '-3.1%', color: '#F97316' },
  { title: 'Dire Dawa Prep', attendance: '75%', trend: '-6.5%', color: '#EF4444' },
];

const directorInsights = [
  { title: 'Assignments graded', value: '1.4K', delta: '+12%', icon: 'edit-3' },
  { title: 'Parent replies', value: '362', delta: '+28%', icon: 'message-circle' },
  { title: 'Incidents cleared', value: '48', delta: '+6%', icon: 'shield-off' },
];

export default function DirectorDashboardScreen() {
  const themeResult = useTheme();
  const { user, logout } = useAuth();
  
  // Ensure theme is always defined with fallback - defensive programming
  // Double check to prevent any undefined access
  let theme = Colors.light; // Default fallback
  try {
    if (themeResult && themeResult.theme) {
      theme = themeResult.theme;
    }
  } catch (error) {
    // If anything goes wrong, use default
    theme = Colors.light;
  }
  
  // Early return if critical dependencies are missing (defensive)
  if (!theme) {
    theme = Colors.light;
  }
  
  // Safe theme property accessors to prevent any undefined errors
  const safeTheme = {
    text: theme?.text || Colors.light.text,
    textSecondary: theme?.textSecondary || Colors.light.textSecondary,
    textTertiary: theme?.textTertiary || Colors.light.textTertiary,
    backgroundDefault: theme?.backgroundDefault || Colors.light.backgroundDefault,
    border: theme?.border || Colors.light.border,
    error: theme?.error || Colors.light.error,
    success: theme?.success || Colors.light.success,
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout().catch((error) => {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <ThemedText style={styles.appTitle}>ደብተርLink</ThemedText>
            <ThemedText style={[styles.appSubtitle, { color: safeTheme.textSecondary }]}>
              Director Control Hub
            </ThemedText>
          </View>
          <Pressable onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: safeTheme.error + '15' }]}>
            <Feather name="log-out" size={18} color={safeTheme.error} />
          </Pressable>
        </View>

        <View style={[styles.hero, { backgroundColor: RoleColors.director + '15' }]}>
          <View style={styles.heroHeader}>
            <View>
              <ThemedText style={styles.heroEyebrow}>Director Control Hub</ThemedText>
              <ThemedText style={styles.heroTitle}>
                {user?.schoolCode || 'Your School'}
              </ThemedText>
        </View>
            <Pressable onPress={() => Alert.alert('Alerts', 'Open director alerts (not implemented)')} style={styles.heroButton}>
              <Feather name="bell" size={18} color="#FFFFFF" />
              <ThemedText style={styles.heroButtonText}>Alerts</ThemedText>
            </Pressable>
          </View>
          <ThemedText style={styles.heroSubtitle}>
            Keep attendance tight, staff energized, and families engaged—everything streams into this cockpit.
          </ThemedText>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <ThemedText style={styles.heroStatLabel}>Today’s Presence</ThemedText>
              <ThemedText style={styles.heroStatValue}>93.4%</ThemedText>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <ThemedText style={styles.heroStatLabel}>Staff Coverage</ThemedText>
              <ThemedText style={styles.heroStatValue}>100%</ThemedText>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <ThemedText style={styles.heroStatLabel}>Parent Responses</ThemedText>
              <ThemedText style={styles.heroStatValue}>87%</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchInput, { backgroundColor: safeTheme.backgroundDefault, borderColor: safeTheme.border }]}>
            <Feather name="search" size={18} color={safeTheme.textSecondary} />
            <TextInput
              placeholder="Search cohort or class"
              placeholderTextColor={safeTheme.textTertiary}
              style={[styles.searchField, { color: safeTheme.text }]}
            />
          </View>
          <Pressable onPress={() => Alert.alert('Filters', 'Open filters (not implemented)')} style={styles.filterButton}>
            <Feather name="sliders" size={18} color="#FFFFFF" />
            <ThemedText style={styles.filterText}>Filters</ThemedText>
          </Pressable>
        </View>

        <View style={styles.quickActionRow}>
          {quickActions.map((action) => (
            <Pressable key={action.label} onPress={() => Alert.alert(action.label)} style={({ pressed }) => [
              styles.quickAction,
              {
                backgroundColor: safeTheme.backgroundDefault,
                borderColor: RoleColors.director + '33',
                opacity: pressed ? 0.8 : 1,
              },
            ]}>
              <Feather name={action.icon as any} size={18} color={RoleColors.director} />
              <ThemedText style={styles.quickActionLabel}>{action.label}</ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Attendance Pulse</ThemedText>
            <Pressable style={styles.linkRow}>
              <ThemedText style={[styles.linkText, { color: RoleColors.director }]}>Weekly</ThemedText>
              <Feather name="chevron-down" size={16} color={RoleColors.director} />
            </Pressable>
          </View>
          <View style={styles.chartContainer}>
            <View style={styles.chartArea}>
              {/* Y-axis labels */}
              <View style={styles.yAxis}>
                {[100, 90, 80, 70].map((value) => (
                  <ThemedText key={value} style={[styles.yAxisLabel, { color: safeTheme.textTertiary }]}>
                    {value}%
                  </ThemedText>
                ))}
              </View>
              
              {/* Chart content */}
              <View style={styles.chartContent}>
                {/* Grid lines */}
                <View style={styles.gridContainer}>
                  {[0, 1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.gridLine,
                        {
                          top: `${i * 33.33}%`,
                          backgroundColor: safeTheme.border,
                        },
                      ]}
                    />
                  ))}
                </View>

                {/* Chart visualization */}
                <View style={styles.chartVisualization}>
                  {(() => {
                    // Capture theme values before IIFE to avoid closure issues
                    const bgColor = safeTheme.backgroundDefault;
                    const data = [92, 88, 94, 90, 96];
                    const maxValue = 100;
                    const chartHeight = 160;
                    const numPoints = data.length;
                    
                    // Calculate positions for each point
                    const points = data.map((value, index) => {
                      const y = chartHeight - (value / maxValue) * chartHeight;
                      const xPercent = (index / (numPoints - 1)) * 100;
                      return { x: xPercent, y, value, index };
                    });
                    
                    return (
                      <>
                        {/* Area gradient effect */}
                        <View style={styles.areaGradient} />
                        
                        {/* Line chart - simplified visual representation */}
                        <View style={styles.lineChartContainer}>
                          {points.map((point, index) => {
                            if (index === 0) return null;
                            
                            const prevPoint = points[index - 1];
                            const isLastSegment = index === points.length - 1;
                            const segmentWidthPercent = 100 / (numPoints - 1);
                            
                            // Create line using a simple approach
                            // Position at the previous point and extend to current
                            const dy = point.y - prevPoint.y;
                            const leftPercent = prevPoint.x;
                            const topY = Math.min(prevPoint.y, point.y);
                            
                            // Use a simple vertical/horizontal approach for reliability
                            const angle = Math.atan2(dy, segmentWidthPercent) * (180 / Math.PI);
                            const lineLength = Math.sqrt(Math.pow(segmentWidthPercent, 2) + Math.pow(dy, 2));
                            
                            return (
                              <View
                                key={`line-${index}`}
                                style={[
                                  styles.chartLineSegment,
                                  {
                                    left: `${leftPercent}%`,
                                    top: prevPoint.y,
                                    width: lineLength,
                                    height: 2.5,
                                    transform: [{ rotate: `${angle}deg` }],
                                    backgroundColor: isLastSegment ? RoleColors.teacher : RoleColors.director,
                                  },
                                ]}
                              />
                            );
                          })}
                        </View>
                        
                        {/* Data points */}
                        <View style={styles.pointsContainer}>
                          {points.map((point) => (
                            <View
                              key={`point-${point.index}`}
                              style={[
                                styles.dataPoint,
                                {
                                  left: `${point.x}%`,
                                  top: point.y - 5,
                                  marginLeft: -5,
                                  backgroundColor: point.index === numPoints - 1 ? RoleColors.teacher : RoleColors.director,
                                  borderColor: bgColor,
                                },
                              ]}
                            />
                          ))}
                        </View>
                      </>
                    );
                  })()}
                </View>

                {/* X-axis labels */}
                <View style={styles.xAxis}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((label, index) => (
                    <View key={index} style={styles.xAxisLabel}>
                      <ThemedText style={[styles.xAxisLabelText, { color: safeTheme.textSecondary }]}>
                        {label}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendPill}>
              <View style={[styles.legendDot, { backgroundColor: RoleColors.director }]} />
              <ThemedText style={styles.legendText}>Baseline</ThemedText>
            </View>
            <View style={styles.legendPill}>
              <View style={[styles.legendDot, { backgroundColor: RoleColors.teacher }]} />
              <ThemedText style={styles.legendText}>Target Burst</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.insightsGrid}>
          {directorInsights.map((insight) => (
            <View key={insight.title} style={[styles.insightCard, { backgroundColor: safeTheme.backgroundDefault }]}>
              <View style={[styles.insightIcon, { backgroundColor: RoleColors.director + '18' }]}>
                <Feather name={insight.icon as any} size={18} color={RoleColors.director} />
            </View>
              <ThemedText style={styles.insightValue}>{insight.value}</ThemedText>
              <ThemedText style={[styles.insightLabel, { color: safeTheme.textSecondary }]}>
                {insight.title}
              </ThemedText>
              <ThemedText style={[styles.insightDelta, { color: safeTheme.success }]}>
                {insight.delta} vs last week
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: safeTheme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Branch Diagnostics</ThemedText>
            <Pressable style={styles.linkRow}>
              <ThemedText style={[styles.linkText, { color: RoleColors.director }]}>Compare</ThemedText>
              <Feather name="chevron-right" size={16} color={RoleColors.director} />
            </Pressable>
          </View>
          {branchComparisons.map((branch, index) => (
            <View 
              key={branch.title} 
              style={[
                styles.branchRow,
                index === branchComparisons.length - 1 && styles.branchRowLast
              ]}
            >
              <View style={styles.branchMeta}>
                <ThemedText style={styles.branchTitle}>{branch.title}</ThemedText>
                <ThemedText style={[styles.branchSubtitle, { color: safeTheme.textSecondary }]}>
                  Attendance momentum
                </ThemedText>
            </View>
              <View style={styles.branchValues}>
                <ThemedText style={[styles.branchAttendance, { color: branch.color }]}>
                  {branch.attendance}
                </ThemedText>
                <View style={styles.branchTrend}>
                  <Feather
                    name={branch.trend.startsWith('-') ? 'trending-down' : 'trending-up'}
                    size={14}
                    color={branch.trend.startsWith('-') ? safeTheme.error : safeTheme.success}
                  />
                  <ThemedText style={[
                    styles.branchTrendText,
                    { color: branch.trend.startsWith('-') ? safeTheme.error : safeTheme.success },
                  ]}>
                    {branch.trend}
              </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: safeTheme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Escalations & Signals</ThemedText>
            <View style={[styles.badge, { backgroundColor: safeTheme.error }]}>
              <ThemedText style={styles.badgeText}>5</ThemedText>
            </View>
          </View>
          {['Transport delay', 'Behavior spike', 'Health alert', 'Curriculum gap'].map((issue, index) => {
            const isLast = index === 3;
            return (
              <View 
                key={issue} 
                style={[
                  styles.signalRow,
                  isLast && styles.signalRowLast
                ]}
              >
                <View style={[styles.signalIcon, { backgroundColor: RoleColors.director + '15' }]}>
                  <Feather name={index % 2 === 0 ? 'alert-triangle' : 'zap'} size={18} color={RoleColors.director} />
                </View>
                <View style={styles.signalMeta}>
                  <ThemedText style={styles.signalTitle}>{issue}</ThemedText>
                  <ThemedText style={[styles.signalSubtitle, { color: safeTheme.textSecondary }]}>
                    {index % 2 === 0 ? 'Action required today' : 'Monitoring only'}
                  </ThemedText>
          </View>
                <Pressable onPress={() => Alert.alert('Signal', 'Resolve clicked')} style={styles.signalButton}>
                  <ThemedText style={styles.signalButtonText}>Resolve</ThemedText>
                </Pressable>
          </View>
            );
          })}
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  hero: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.md,
    marginTop: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  heroEyebrow: {
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    lineHeight: 16,
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.5,
    marginTop: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1F2937',
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: RoleColors.director,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    minHeight: 40,
    shadowColor: RoleColors.director,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(217, 119, 6, 0.1)',
  },
  heroStat: {
    flex: 1,
    gap: Spacing.xs,
  },
  heroStatLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6B7280',
    lineHeight: 14,
  },
  heroStatValue: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  heroStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchField: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 0,
  },
  filterButton: {
    flexDirection: 'row',
    backgroundColor: RoleColors.director,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    height: 44,
    shadowColor: RoleColors.director,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  quickAction: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    gap: Spacing.xs,
    minHeight: 72,
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.md,
    marginTop: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  chartContainer: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chartArea: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    width: 36,
    justifyContent: 'space-between',
    paddingRight: Spacing.xs,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  yAxisLabel: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'right',
    fontWeight: '500',
  },
  chartContent: {
    flex: 1,
    position: 'relative',
    height: 160,
    marginTop: Spacing.xs,
    paddingRight: Spacing.xs,
  },
  gridContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    opacity: 0.3,
  },
  chartVisualization: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  areaGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: RoleColors.director + '12',
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
  },
  lineChartContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  chartLineSegment: {
    position: 'absolute',
    borderRadius: 1.5,
    transformOrigin: 'left center',
  },
  pointsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dataPoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2.5,
    marginLeft: -5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  xAxis: {
    position: 'absolute',
    bottom: -24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  xAxisLabel: {
    flex: 1,
    alignItems: 'center',
  },
  xAxisLabelText: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  legendRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3F4F6',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  insightCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    gap: Spacing.xs,
    minHeight: 100,
  },
  insightIcon: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.3,
    marginBottom: Spacing.xs,
  },
  insightLabel: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: Spacing.xs,
  },
  insightDelta: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: Spacing.sm,
  },
  branchRowLast: {
    borderBottomWidth: 0,
  },
  branchMeta: {
    flex: 1,
    gap: Spacing.xs,
  },
  branchTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  branchSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  branchValues: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  branchAttendance: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  branchTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  branchTrendText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  signalRowLast: {
    borderBottomWidth: 0,
  },
  signalIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signalMeta: {
    flex: 1,
    gap: Spacing.xs,
  },
  signalTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  signalSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  signalButton: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: RoleColors.director,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minHeight: 32,
    justifyContent: 'center',
  },
  signalButtonText: {
    color: RoleColors.director,
    fontWeight: '600',
    fontSize: 11,
    textTransform: 'uppercase',
    lineHeight: 14,
    letterSpacing: 0.5,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  topBarLeft: {
    flex: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  appSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
     /* backgroundColor moved into component-level inline style to avoid
       referencing `theme` at module scope where it's not defined. */
  },
});
