import classNames from "classnames";
import React, { CSSProperties, FC, HTMLAttributes, ReactNode, useContext, useMemo } from "react";
import './index.scss'
import { ConfigContext } from "./ConfigProvider";

export type SizeType = 'small' | 'middle' | 'large' | number | undefined;

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    style?: CSSProperties;
    size?: SizeType | [SizeType, SizeType];
    direction?: 'horizontal' | 'vertical';
    align?: 'start' | 'end' | 'center' | 'baseline';
    split?: ReactNode;
    wrap?: boolean;
}

const spaceSize = {
    small: 8,
    middle: 16,
    large: 24,
}

// 将size转为具体的值
function getNumberSize(size: SizeType) {
    return typeof size === 'string' ? spaceSize[size] : size || 0;
}

const Space: FC<SpaceProps> = props => {
    // 配置ConfigProvider
    const { space } = useContext(ConfigContext)

    const {
        className,
        style,
        children,
        size = space?.size || 'small', // 这样size默认值会优先使用context里的值
        direction = 'horizontal',
        align,
        split,
        wrap = false,
        ...otherProps
    } = props

    // 让每层 child 被 space-item 包裹
    const childNodes = React.Children.toArray(children);

    const nodes = childNodes.map((child: any, i) => {

        // eslint-disable-next-line no-mixed-operators
        const key = child && child.key || `space-item-${i}`;

        return <>
            <div className="space-item" key={key}>{child}</div>
            {/* split 分隔符 */}
            {i < childNodes.length - 1 && childNodes.length > 1 && split && (
                <span className={`${className}-split`} style={style}>{split}</span>
            )}
        </>
    });

    // 处理direction 和 align
    const mergedAlign = direction === 'horizontal' && align === undefined ? 'center' : align;
    const cn = classNames(
        'space',
        `space-${direction}`,
        {
            [`space-align-${mergedAlign}`]: mergedAlign,
        },
        className,
    )

    // 根据传入的 size 来计算间距
    const otherStyles: CSSProperties = {};

    const [horizontalSize, verticalSize] = useMemo(() => (
        // 如果不是数组，就要扩展成数组
        (Array.isArray(size) ? size : [size, size] as [SizeType, SizeType]).map(item => getNumberSize(item))
    ), [size]);

    // 根据 size 设置 column-gap 和 row-gap 的样式，如果有 wrap 参数，还要设置 flex-wrap
    otherStyles.columnGap = horizontalSize;
    otherStyles.rowGap = verticalSize;

    if (wrap) {
        otherStyles.flexWrap = 'wrap';
    }

    return <div className={cn} style={{
        ...otherStyles, ...style
    }} {...otherProps}>
        {nodes}
    </div>
}

export default Space;