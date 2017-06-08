import spring from 'react-motion/lib/spring';

const fadeConfig = { stiffness: 200, damping: 22 };
const slideConfig = { stiffness: 330, damping: 30 };

export const slideLeft = {
    atEnter: {
        opacity: 0,
        offset: 100,
    },
    atLeave: {
        opacity: spring(0, fadeConfig),
        offset: spring(-100, slideConfig)
    },
    atActive: {
        opacity: spring(1, slideConfig),
        offset: spring(0, slideConfig)
    },
    mapStyles(styles) {
        return {
            opacity: styles.opacity,
            transform: `translateX(${styles.offset}%)`
        };
    }
};

export default slideLeft;
