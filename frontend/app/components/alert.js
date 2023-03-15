import Component from '@glimmer/component';

export default class AlertComponent extends Component {
  get classes() {
    let c;
    switch (this.args.level) {
      case 'danger':
        c = `border-red-bright bg-red-lighter dark:bg-red-darker`;
        break;
      case 'warning':
        c = `border-yellow-bright bg-yellow-lighter dark:bg-yellow-darker`;
        break;
      case 'success':
        c = `border-green-bright bg-green-lighter dark:bg-green-darker`;
        break;
      default:
        c = `border-blue-bright bg-blue-lighter dark:bg-blue-darker`;
        break;
    }
    if (this.args.class) return `${this.args.class} ${c}`;
    return c;
  }
}
