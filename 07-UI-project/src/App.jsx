import Section1 from "./components/section1/Section1";
// import Section2 from "./components/section2/Section2";

const App = () => {
  const users = [
  {
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    intro: "Customers who are happy with their current financial services and continue to find value in them.",
    tag: "Satisfied",
  },
  {
    img: "https://images.unsplash.com/photo-1507206130118-b5907f817163?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    intro: "People whose needs aren't fully met by existing products and services.",
    tag: "Underserved",
  },
  {
    img: "https://plus.unsplash.com/premium_photo-1661641353075-f0eaf2d82aae?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    intro: "Individuals with limited access to traditional banking and financial facilities.",
    tag: "Underbanked",
  },
  {
    img: "https://plus.unsplash.com/premium_photo-1661630621969-6d9faac03f9f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    intro: "Everyday customers with typical expectations and standard financial needs.",
    tag: "Average",
  },
  {
    img: "https://images.unsplash.com/photo-1600275669283-4bf2bb8a990c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    intro: "Potential customers who are still exploring their options before making a decision.",
    tag: "Undecided",
  },
];
  return (
    <div>
      <Section1 users={users}/>
    </div>
  );
};

export default App;
