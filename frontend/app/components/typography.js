import Component from '@glimmer/component';

export default class TypographyComponent extends Component {
  get level() {
    if (['h1', 'h2', 'h3', 'p'].includes(this.args.level)) {
      return this.args.level;
    }
    return 'p';
  }

  get classes() {
    let baseClasses = [];
    if (['h1', 'h2', 'h3'].includes(this.level)) {
      baseClasses = baseClasses.concat(['font-display', 'font-bold']);
    }
    switch (this.args.level) {
      case 'h1':
        baseClasses.push('text-2xl');
        break;
      case 'h2':
        baseClasses.push('text-xl');
        break;
      case 'h3':
        baseClasses.push('text-lg');
        break;
      default:
        break;
    }
    if (this.args.class) {
      baseClasses.push(this.args.class);
    }
    return baseClasses.join(' ');
  }
}
