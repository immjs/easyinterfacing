import VueTypes, { toValidableType, toType } from 'vue-types';
import { TLBRKeys, MaybePair } from '@/data';

export default class EITypes extends VueTypes {
  static get pair() {
    return toType('pair', {
      type: Array,
      validator: (arr: number[]) => arr.length === 2,
    });
  }

  static TLBR(args: { isPos?: boolean }) {
    return toValidableType('TLBR', {
      type: Object as () => Record<TLBRKeys, MaybePair<number>>,
      validator: (obj: Record<TLBRKeys, MaybePair<number>>) => {
        if (!args.isPos) return true;
        return ('top' in obj || 'bottom' in obj) && ('right' in obj || 'left' in obj);
      },
    });
  }
}
