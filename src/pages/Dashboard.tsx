// Dashboard.tsx
import { Component } from 'react';

interface DashboardProps {}

interface DashboardState {}

export default class Dashboard extends Component<DashboardProps, DashboardState> {
  render() {
    return (
      <div>
        Dashboard. This is a protected route. You can only see this if you're authenticated.
      </div>
    );
  }
}
