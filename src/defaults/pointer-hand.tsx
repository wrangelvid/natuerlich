import { XIntersection } from "@coconut-xr/xinteraction";
import { InputDeviceFunctions, XStraightPointer } from "@coconut-xr/xinteraction/react";
import React, { ReactNode, useRef } from "react";
import { DynamicHandModel, HandBoneGroup } from "../react/hand.js";
import { useInputSourceEvent } from "../react/listeners.js";
import { SpaceGroup } from "../react/space.js";
import { BoxGeometry } from "three";

const geometry = new BoxGeometry();
geometry.translate(0, 0, -0.5);

export function PointerHand({
  hand,
  inputSource,
  id,
  children,
  filterIntersections,
}: {
  hand: XRHand;
  inputSource: XRInputSource;
  children?: ReactNode;
  id: number;
  filterIntersections?: (intersections: XIntersection[]) => XIntersection[];
}) {
  const pointerRef = useRef<InputDeviceFunctions>(null);

  useInputSourceEvent("selectstart", inputSource, (e) => pointerRef.current?.press(0, e), []);
  useInputSourceEvent("selectend", inputSource, (e) => pointerRef.current?.release(0, e), []);

  return (
    <>
      <DynamicHandModel hand={hand} handedness={inputSource.handedness}>
        {children != null ?? <HandBoneGroup joint="wrist">{children}</HandBoneGroup>}
      </DynamicHandModel>
      <SpaceGroup space={inputSource.targetRaySpace}>
        <group rotation-y={Math.PI}>
          <XStraightPointer filterIntersections={filterIntersections} id={id} ref={pointerRef} />
        </group>
        <mesh scale={[0.01, 0.01, 1]} geometry={geometry}>
          <meshBasicMaterial color={0xffffff} />
        </mesh>
      </SpaceGroup>
    </>
  );
}
