import hero from "../assets/bg/hero.webp"
import Navbar from "../components/Navbar";
import FEATURES from "../data/features";
import TECHNOLOGIES from "../data/technologies";

export default function Landing() {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800 gap-y-4 overflow-y-hidden">

      {/* Navbar */}
      <Navbar/>
      <div className="flex flex-col" >
        {/* Hero Section */}
        <section
            className="
                flex flex-col-reverse md:flex-row
                items-center
                px-6 md:px-10
                py-16 md:py-20
                gap-8 md:gap-10
                min-h-screen
            "
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(39, 189, 213, 0.8), rgba(4, 64, 15, 0.8)), url(${hero})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            >
            <div className="flex flex-col text-center items-center md:text-left mb-4 md:mb-0 md:items-start">
                {/* Responsive Title */}
                <h2 className="
                    font-extrabold
                    text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                    bg-white bg-clip-text text-transparent
                    leading-tight
                ">
                Revolusionize <br /> The Plant Caring <br /> Better!
                </h2>

                {/* Responsive paragraph */}
                <p className="text-base sm:text-lg text-gray-100 mt-4 mb-6 max-w-lg mx-auto md:mx-0">
                Discover how effortless growing healthy plants can be. Smart tools,
                simple routines, and greener living.
                </p>

                {/* Responsive Button */}
                <button className="
                px-6 py-3 md:px-8 md:py-4
                bg-green-600 text-white rounded-md
                hover:bg-green-700 transition
                text-sm sm:text-base
                ">
                Explore Now
                </button>

            </div>
            </section>

        {/* Product Advancements */}
        <section className="flex flex-col px-10 py-20 min-h-screen items-center justify-center">
            <div className="mb-8">
                <h3 
                    className="
                    text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                    font-extrabold 
                    bg-linear-to-r 
                    from-green-400 
                    to-blue-500 
                    bg-clip-text 
                    text-transparent 
                    text-center"
                >
                    Our product advancements
                </h3>

                <h4 className="text-xl font-light text-center mb-2">
                    We're not only revolutionizing plant care, but also enhancing, making it more engaging for everyone.
                </h4>
            </div>

            <div className="grid md:grid-cols-4 gap-8 text-center">
                {FEATURES.map((item, idx) => (
                    <div
                    key={idx}
                    className="
                        group
                        p-6 bg-gray-50 border rounded-xl shadow-sm transition
                        hover:shadow-md
                        hover:bg-linear-to-r hover:from-green-500 hover:to-emerald-600
                    "
                    >
                    {item.image && (
                        <img src={item.image} className="w-32 mb-4 mx-auto" />
                    )}

                    <h4 className="
                        text-xl font-semibold mb-2 
                        transition 
                        group-hover:text-white
                    ">
                        {item.title}
                    </h4>

                    <p className="
                        text-gray-600 text-center 
                        transition 
                        group-hover:text-white
                    ">
                        {item.description}
                    </p>
                    </div>
                ))}
            </div>
        </section>


        <section className="px-10 py-20 bg-white items-center justify-center flex flex-col min-h-screen">
            <h3 
                className="
                text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                font-extrabold 
                bg-linear-to-r 
                from-green-400 
                to-blue-500 
                bg-clip-text 
                text-transparent 
                text-center
                mb-4
                "
            >
                Plantzen Supporting Technologies
            </h3>

            <h4 className="text-xl font-light text-center mb-4">
                Plantzen were made with love, not only by our unpaid teams, but also made by these amazing open source technologies.
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 text-center">
                {TECHNOLOGIES.map((tech, idx) => (
                <div
                    key={idx}
                    className="
                    group
                    p-6 bg-gray-50 border rounded-xl shadow-sm transition
                    hover:shadow-md
                    hover:bg-linear-to-r hover:from-green-500 hover:to-emerald-600
                    "
                >
                    {tech.icon && (
                    <img
                        src={tech.icon}
                        className="w-16 h-auto mb-4 mx-auto transition"
                        alt={tech.name}
                    />
                    )}

                    <h4 className="text-xl font-semibold mb-2 transition group-hover:text-white">
                    {tech.name}
                    </h4>

                    <p className="text-gray-600 transition group-hover:text-white">
                    {tech.description}
                    </p>
                </div>
                ))}

            </div>
        </section>

        {/* Footer CTA */}
        <footer className="py-20 text-center bg-gray-100">
            <h2 className="text-3xl font-extrabold mb-4">Let's Try It Out!</h2>
            <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            Start for Free
            </button>
        </footer>
      </div>
      
    </div>
  );
}
