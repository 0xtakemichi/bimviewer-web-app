// Home.tsx
import { Component } from 'react';

interface HomeProps {}

interface HomeState {}

export default class Home extends Component<HomeProps, HomeState> {
  render() {
    return (
      <div>
        Home. Not Protected. Anyone can see this.
      </div>
    );
  }
}
