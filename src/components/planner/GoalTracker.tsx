import React from 'react';
import { STRATEGIC_GOALS, Directive, StrategicGoal } from '../../utils/glossary';

interface GoalTrackerProps {
  activeDirectives: Directive[];
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ activeDirectives }) => {
  const calculateProgress = (goalId: string): number => {
    const goalTasks = activeDirectives.filter((d: Directive) => d.goalId === goalId);
    if (goalTasks.length === 0) return 0;
    const completed = goalTasks.filter((d: Directive) => d.status === 'completed').length;
    return (completed / goalTasks.length) * 100;
  };

  return (
    <div className="goal-tracker-container">
      {Object.values(STRATEGIC_GOALS).map((goal: StrategicGoal) => (
        <div key={goal.id} className="goal-card">
          <div className="goal-header">
            <span className="goal-label">{goal.label}</span>
            <span className="goal-percentage">{Math.round(calculateProgress(goal.id))}%</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${calculateProgress(goal.id)}%`,
                backgroundColor: goal.color 
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalTracker;