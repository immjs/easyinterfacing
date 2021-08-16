<template>
  <div class="element">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EITypes from '@/prop-types';
import {
  MaybeArray,
  MaybePair,
  Pair,
  EIError,
  isNullish,
} from '@/data';

interface PropsElement extends Record<string, any> {
  top?: MaybePair<number>;
  bottom?: MaybePair<number>;
  left?: MaybePair<number>;
  right?: MaybePair<number>;
}

export default defineComponent({
  name: 'element',
  props: {
    top: EITypes.oneOfType([EITypes.number, EITypes.pair]),
    left: EITypes.oneOfType([EITypes.number, EITypes.pair]),
    right: EITypes.oneOfType([EITypes.number, EITypes.pair]),
    bottom: EITypes.oneOfType([EITypes.number, EITypes.pair]),
    // pos: EITypes.TLBR({ isPos: true }).def((): Record<string, number | [number, number]> => ({})),
    padding: EITypes.oneOfType([
      EITypes.number,
      EITypes.arrayOf(EITypes.number),
      EITypes.TLBR({ isPos: false }),
    ]).def(0),
    margin: EITypes.oneOfType([
      EITypes.number,
      EITypes.arrayOf(EITypes.number),
      EITypes.TLBR({ isPos: false }),
    ]).def(0),
    'z-index': {
      validator: (arr: MaybeArray<MaybePair<number>>): boolean => {
        if (typeof arr === 'number') return true;
        return arr.every((n: MaybePair<number>) => typeof n === 'number' || n.length <= 2);
      },
      default: () => [0],
    },
    width: EITypes.oneOfType([EITypes.number, EITypes.pair]),
    height: EITypes.oneOfType([EITypes.number, EITypes.pair]),
  },
  computed: {
    props_computed() {
      const propsFns = {
        toPair: (n?: MaybePair<number>, defVal: number = 0): Pair<number> | undefined => {
          if (typeof n === 'number') return [n, defVal];
          if (Array.isArray(n) && n.length === 1) return [n[0], defVal];
          return n;
        },
        wrapArr: (a?: MaybeArray<MaybePair<number>>, defVal?: number) => {
          if (a == null) return a;
          let result: any = a; // @ts-ignore
          if (typeof result === 'number') result = [a];
          for (let i = 0; i < result.length; i += 1) { // @ts-ignore
            if (typeof result[i] === 'number') {
              result[i] = [result[i], isNullish(defVal) ? result[i] : defVal];
            } else if (result[i].length === 1) {
              result[i] = [result[i][0], isNullish(defVal) ? result[i][0] : defVal];
            }
          }
          return result as Array<[number, number]>;
        },
      };

      const argumentRestrictions = [
        ['top', 'bottom', 'height'],
        ['left', 'right', 'width'],
      ];

      argumentRestrictions.forEach((argumentRestriction) => {
        if (argumentRestriction.every((arg) => arg in this)) {
          throw new EIError(`You are calling ${this.$options.name} with a top and bottom argument, but are also providing the height. This behaviour is not allowed.`);
        }
      });

      const nullishCo = (a: any, ...b: any[]): any => (a == null && b.length > 0
        ? nullishCo(b[0], ...b.slice(1))
        : a
      );
      const checkPosToPair = (prop: 'top' | 'bottom' | 'left' | 'right') => propsFns.toPair(nullishCo(this[prop], this.pos[prop], this.inset) as MaybePair<number>);

      const currObj = {
        top: checkPosToPair('top'),
        bottom: checkPosToPair('bottom'),
        left: checkPosToPair('left'),
        right: checkPosToPair('right'),
        height: propsFns.toPair(this.height as MaybePair<number>),
        width: propsFns.toPair(this.width as MaybePair<number>),
        'z-index': propsFns.wrapArr(this['z-index']),
      };

      const cumulatedProperties: Record<string, Pair<number>> = {};

      type determineFnReturn = [
        Pair<number> | undefined,
        Pair<number> | undefined,
        ...([Pair<number>, Pair<number>] | [Pair<number>, undefined] | [undefined, Pair<number>])
      ];

      const determine: [string, () => determineFnReturn][] = [
        ['height', () => [currObj.bottom, currObj.top, currObj.height, [100, 0]]],
        ['top', () => [currObj.bottom, currObj.height, currObj.top, [100, 0]]],
        ['width', () => [currObj.right, currObj.left, currObj.width, [100, 0]]],
        ['left', () => [currObj.right, currObj.width, currObj.left, [100, 0]]],
      ] as [string, () => determineFnReturn][];

      const pairSubstract = (pairA: Pair<number>, pairB: Pair<number>): Pair<number> => [
        pairA[0] - pairB[0],
        pairA[1] - pairB[1],
      ];

      determine.forEach(([k, v]: [string, () => determineFnReturn]) => {
        const [pairA, pairB, originalProp, defaultValue] = v();
        if (originalProp != null) {
          cumulatedProperties[k] = originalProp;
          return;
        }
        if (pairA != null && pairB != null) {
          cumulatedProperties[k] = pairSubstract(pairA, pairB);
          return;
        } // @ts-ignore
        cumulatedProperties[k] = defaultValue;
      });

      return determine;
    },
  },
} as PropsElement);
</script>

<style lang="scss">

</style>
