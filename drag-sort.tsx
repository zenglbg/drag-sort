import React, { useEffect, useRef, useState } from 'react';
import { range } from 'ramda';
import { from, fromEvent } from 'rxjs';
import { concatAll, concatMap, map, mergeMap, takeUntil } from 'rxjs/operators';

export default function () {
  const container = useRef<HTMLDivElement>(null);
  const drag = useRef<HTMLDivElement>(null);

  const [list, setList] = useState(range(1, 10));

  useEffect(() => {
    console.log(list);
    const mouseDown$ = fromEvent<MouseEvent>(container.current, 'mousedown');
    const mouseDown1$ = fromEvent<MouseEvent>(document, 'mousedown');
    const mouseMove$ = fromEvent(container.current, 'mousemove');
    const mouseUp$ = fromEvent(container.current, 'mouseup');

    console.log(drag);
    mouseDown1$
      .pipe(
        map<
          MouseEvent & { target: HTMLDivElement },
          {
            target: HTMLDivElement;
            left: number;
            top: number;
            clickOffsetX: number;
            clickOffsetY: number;
          }
        >(({ target, clientX, clientY }) => {
          container.current.style.position = 'relative';
          const { left, top } = target.getBoundingClientRect();
          target.style.position = 'absolute';
          const result = list.filter(
            (r) => r !== Number(target.getAttribute('data-id'))
          );
          console.log(result, 'result', target.getAttribute('data-id'));
          setList(result);

          return {
            target,
            left,
            top,
            clickOffsetX: clientX - left,
            clickOffsetY: clientY - top,
          };
        }),
        concatMap(({ target, clickOffsetX, clickOffsetY }) => {
          return mouseMove$.pipe(
            takeUntil<MouseEvent>(mouseUp$),
            map<MouseEvent, { x: number; y: number; target: HTMLDivElement }>(
              ({ clientX, clientY }) => {
                return {
                  x: clientX - clickOffsetX,
                  y: clientY - clickOffsetY,
                  target,
                };
              }
            )
          );
        })
      )
      .subscribe(({ x, y, target }) => {
        console.log(x, y, target, 'x, y, target ');
        target.style.left = `${x}px`;
        target.style.top = `${y}px`;
      });
  });

  return (
    <div className="container" ref={container}>
      <p>{list}</p>
      {list.map((r) => (
        <div className={`item item-${r}`} data-id={r} key={r} ref={drag}>
          <a>{r}</a>
        </div>
      ))}
    </div>
  );
}
