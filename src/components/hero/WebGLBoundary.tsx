import { Component, type ReactNode } from "react";
// Decorative graphics must never prevent access to the portfolio.
export class WebGLBoundary extends Component<
  { children: ReactNode },
  {
    failed: boolean;
  }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
