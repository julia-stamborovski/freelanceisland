import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import jamesonExample from '../assets/jameson.jpg'
import teste01 from '../assets/teste01.png'
import teste02 from '../assets/teste02.png'
import teste03 from '../assets/teste03.png'
import teste08 from '../assets/teste08.png'
import teste05 from '../assets/teste05.png'
import teste06 from '../assets/teste06.png'
import teste09 from '../assets/teste09.png'
import teste07 from '../assets/teste07.png'


const Example = () => {
  return (
    <div className="bg-neutral-800">
      <HorizontalScrollCarousel />
    </div>
  );
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200 rounded-md"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-3 text-4xl font-black uppercase text-white backdrop-blur-sm rounded-lg">
          {card.title}
        </p>   <a href={card.link} target="_blank" rel="noopener noreferrer">
          <button className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-2xl underline uppercase text-white backdrop-blur-sm mt-2 rounded-lg">
            Ver
          </button></a>
      </div>
    </div>
  );
};

export default Example;

const cards = [
  {
    url: teste06,
    title: "Quiz",
    id: 1,
    link: 'https://quiz-phygital.web.app',
  },
  {
    url: teste02,
    title: "Jogo da Memória",
    id: 2,
    link: 'https://memory-game-phygital.vercel.app'
  },
  {
    url: teste03,
    title: "Teste Cego",
    id: 3,
    link: 'https://ninho-nestle-teste-cego-demo.web.app',
  },
  {
    url: teste08,
    title: "Avaturn",
    id: 4,
    link: 'https://bonjourlab.avaturn.dev/login'
  },
  {
    url: teste07,
    title: "Raspadinha",
    id: 5,
    link: 'https://raspadinhav0.web.app',
  },
];