
if (!("remove" in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

// mapboxgl.accessToken = "pk.eyJ1IjoiZG9jLWRpdmFnbyIsImEiOiJja2NnbXU0ancwdGx1MnhtMm1pdzV5cWd4In0.NXt0RiFp4HjZ_iy55WADkg"; // token generico

mapboxgl.accessToken = "pk.eyJ1IjoiZ2FidHJpcCIsImEiOiJjbHdoeG9neGEwMGYwMmpzd283dWg2c3hqIn0.7JK3k4zD9eU0OM9iurp0Xg"; // token stile personalizzato
/**
 * Add the map to the page
 */
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/gabtrip/clwkh3joc00rx01ny76o4hfkn", // stile personalizzato 
  // style: "mapbox://styles/mapbox/streets-v12", // stile generico
  // center: [12.608438888126923, 42.933064240993126],
  center:[12.608639140444703, 42.933365079779506],
  zoom: 15.9,
  scrollZoom: true,
});

//compass
const nav = new mapboxgl.NavigationControl({
  showCompass: true,
});
map.on("load", function (e) {
  map.addControl(nav, "bottom-right");
});
var stores = {
  type: "FeatureCollection",
  features: [      
    // PORTALS GAITE
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.608231387105889, 42.932829261692824],
      }, 
      properties: {
        address_it: "Portale Mercato delle Gaite",
        address_en: "Mercato delle Gaite Portal",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "Se hai l'app Zappar già installata sul tuo dispositivo, cliccando sul link sottostante l'esperienza si attiverà direttamente. \n\nSe non hai l'app Zappar verrai portato ad una schermata che ti consentirà di scaricarla",
        description_en: "If you don't have the Zappar app, you'll be redirected to the app store to download it, then you can enjoy the portal!",
        markerType: "portals",
        site: "https://webxr.run/Vb5Adgw582d6Z",
      },
    },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.608045948399779, 42.9328888254322],
    //   }, 
    //   properties: {
    //     address_it: "Portale Gaita San Giovanni",
    //     address_en: "Gaita San Giovanni Portal",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "",
    //     markerType: "portals",
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.608180148251774, 42.932735250662574],
    //   }, 
    //   properties: {
    //     address_it: "Portale Gaita San Giorgio",
    //     address_en: "Gaita San Giorgio Portal",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "",
    //     description_en: "",
    //     markerType: "portals",
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.607844084756854, 42.93267580226183],
    //   }, 
    //   properties: {
    //     address_it: "Portale Gaita San Pietro",
    //     address_en: "Gaita San Pietro Portal",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "",
    //     description_en: "",
    //     markerType: "portals",
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.60797151822976, 42.932599840332955],
    //   }, 
    //   properties: {
    //     address_it: "Portale Gaita Santa Maria",
    //     address_en: "Gaita Santa Maria Portal",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "",
    //     description_en: "",
    //     markerType: "portals",
    //   },
    // },
    // END PORTALS GAITE
    
    // MESTIERI GAITE
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.610776563411152, 42.934996177151284],
      }, 
      properties: {
        address_it: "Mestiere Gaita San Giovanni",
        address_en: "Gaita San Giovanni Craft",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "",
        description_en: "",
        markerType: "sanGiovanni",
        site: "/assets/renpy/Cartiera/index.html",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.607107126589524, 42.93244475232125],
      }, 
      properties: {
        address_it: "Mestiere Gaita San Pietro",
        address_en: "Gaita San Pietro Craft",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "",
        description_en: "",
        markerType: "sanPietro",
        site: "/assets/renpy/Cereria/index.html",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.609526419514012, 42.93342634588887],
      }, 
      properties: {
        address_it: "Mestiere Gaita San Giorgio",
        address_en: "Gaita San Giorgio Craft",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "",
        description_en: "",
        markerType: "sanGiorgio",
        site: "/assets/renpy/Dipintore/index.html",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.60748257632491, 42.93164125523298],
      }, 
      properties: {
        address_it: "Mestiere Gaita Santa Maria",
        address_en: "Gaita Santa Maria Craft",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "",
        description_en: "",
        markerType: "santaMaria",
        site: "/assets/renpy/Setificio/index.html",
      },
    },
    // END MESTIERI GAITE

    // PARCHEGGI
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.609182121969642, 42.93573297119598],
      }, 
      properties: {
        address_it: "Parcheggio Piazzale Masci Mindolfo",
        address_en: "Piazzale Masci Mindolfo Parking",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "Parcheggio a pagamento",
        description_en: "Toll Parking",
        markerType: "parking",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.606431742030377, 42.93451733301161],
      }, 
      properties: {
        address_it: "Parcheggio Piazzale dell' Accoglienza",
        address_en: "Piazzale dell' Accoglienza Parking",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "Parcheggio a pagamento",
        description_en: "Toll Parking",
        markerType: "parking",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.609730858967609, 42.93153631439249],
      }, 
      properties: {
        address_it: "Parcheggio Centro",
        address_en: "Central Parking",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "Parcheggio a pagamento",
        description_en: "Toll Parking",
        markerType: "parking",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.607646027494551, 42.93576703186645],
      }, 
      properties: {
        address_it: "Parcheggio Gratuito",
        address_en: "Free Parking",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "Parcheggio gratuito",
        description_en: "Free Parking",
        markerType: "parking",
      },
    },
    // FINE PARCHEGGI
    
    // ENTRANCE POINT
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.608935189233497, 42.931891328001676],
      }, 
      properties: {
        address_it: "Ingresso Porta Todi",
        address_en: "Porta Todi Entrance",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: ``,
        description_en: "",
        markerType: "entrance",
        img: "./assets/img/card_background/Porta_Todi.jpeg",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.609511886234214, 42.935485935049634],
      }, 
      properties: {
        address_it: "Ingresso Porta Cannara",
        address_en: "Porta Cannara Entrance",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: ``,
        description_en: "",
        markerType: "entrance",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.606836665994416, 42.934022587832004],
      }, 
      properties: {
        address_it: "Ingresso Porta Guelfa",
        address_en: "Porta Guelfa Entrance",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: ``,
        description_en: "",
        markerType: "entrance",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.61153788980332, 42.93485095938446],
      }, 
      properties: {
        address_it: "Ingresso Porta Foligno",
        address_en: "Porta Foligno Entrance",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: ``,
        description_en: "",
        markerType: "entrance",
      },
    },
    // END ENTRANCE POINT
    
    //TODO to use during shu2024
    // POINT OF INTEREST 
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.607804872878202, 42.93274584330837],
    //   }, 
    //   properties: {
    //     address_it: "Collegiata di San Michele Arcangelo",
    //     address_en: "Collegiate of San Michele Arcangelo",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "La Collegiata di San Michele Arcangelo di Bevagna, edificata tra il XII e il XIII secolo, è un magnifico esempio di architettura romanica. La sua imponente facciata, ornata da un elegante rosone e portali scolpiti, introduce a un interno maestoso con una navata centrale spaziosa e cappelle laterali riccamente decorate. Tra le opere d'arte conservate all'interno, spiccano affreschi e dipinti di rilevante valore storico e artistico. La collegiata, dedicata a San Michele Arcangelo, non solo è un importante luogo di culto, ma anche un simbolo della storia e della cultura di Bevagna.",
    //     description_en: "The Collegiate Church of San Michele Arcangelo in Bevagna, built between the 12th and 13th centuries, is a magnificent example of Romanesque architecture. Its imposing facade, adorned with an elegant rose window and sculpted portals, leads to a majestic interior with a spacious central nave and richly decorated side chapels. Among the artworks preserved inside, frescoes and paintings of significant historical and artistic value stand out. The collegiate church, dedicated to San Michele Arcangelo, is not only an important place of worship but also a symbol of the history and culture of Bevagna.",
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/San_Michele.jpg"
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.60805967681525, 42.932572241665866],
    //   }, 
    //   properties: {
    //     address_it: "Chiesa di San Silvestro",
    //     address_en: "Church of San Silvestro",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "La Chiesa di San Silvestro di Bevagna, costruita nel 1195, è un notevole esempio di architettura romanica. La sua facciata austera e gli interni sobri riflettono l'essenzialità e la purezza dello stile romanico. L'edificio presenta una pianta a croce latina e conserva elementi architettonici originali, come le colonne con capitelli decorati e le eleganti arcate. La chiesa, situata nel cuore della città, rappresenta un'importante testimonianza della storia medievale di Bevagna e un luogo di contemplazione e raccoglimento.",
    //     description_en: "The Church of San Silvestro in Bevagna, built in 1195, is a remarkable example of Romanesque architecture. Its austere facade and simple interiors reflect the essentiality and purity of the Romanesque style. The building features a Latin cross plan and retains original architectural elements, such as columns with decorated capitals and elegant arches. Located in the heart of the city, the church represents an important testament to the medieval history of Bevagna and a place of contemplation and reflection.",
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/San_Silvestro.jpg"
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.60851520005717, 42.93280014873804],
    //   }, 
    //   properties: {
    //     address_it: "Chiesa dei Santi Domenico e Giacomo",
    //     address_en: "Church of Saints Domenico and Giacomo",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "La Chiesa dei Santi Domenico e Giacomo di Bevagna, eretta nel XIV secolo, è un pregevole esempio di architettura gotica umbra. La facciata, semplice e austera, nasconde un interno ricco di dettagli artistici. Gli affreschi che adornano le pareti, realizzati da maestri locali, testimoniano la vivacità culturale e religiosa dell'epoca. La chiesa, dedicata a San Domenico e a San Giacomo, è un luogo di profonda spiritualità e offre ai visitatori uno scorcio autentico della storia e dell'arte medievale di Bevagna.",
    //     description_en: "The Church of Saints Domenico and Giacomo in Bevagna, erected in the 14th century, is an exquisite example of Umbrian Gothic architecture. The simple and austere facade hides an interior rich in artistic details. The frescoes adorning the walls, created by local masters, testify to the cultural and religious vibrancy of the era. The church, dedicated to Saint Domenico and Saint Giacomo, is a place of deep spirituality and offers visitors an authentic glimpse into the medieval history and art of Bevagna.",
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/San_Domenico.jpg"
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.610027931636044, 42.93529424090502],
    //   }, 
    //   properties: {
    //     address_it: "Chiesa di San Francesco",
    //     address_en: "Church of San Francesco",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "La Chiesa di San Francesco di Bevagna, edificata nel XIII secolo, è un suggestivo esempio di architettura gotica francescana. Situata nel cuore della città, la chiesa presenta una facciata semplice ma elegante, con un portale finemente decorato. L'interno, caratterizzato da una navata unica, ospita pregevoli affreschi e opere d'arte che raccontano la vita di San Francesco e la storia religiosa della regione. La chiesa, con la sua atmosfera raccolta e spirituale, è un luogo di grande importanza storica e culturale per Bevagna, riflettendo la profonda devozione francescana della comunità locale.",
    //     description_en: "The Church of San Francesco in Bevagna, built in the 13th century, is an evocative example of Franciscan Gothic architecture. Located in the heart of the city, the church features a simple yet elegant facade with a finely decorated portal. The interior, characterized by a single nave, houses valuable frescoes and artworks that narrate the life of San Francesco and the religious history of the region. The church, with its intimate and spiritual atmosphere, is a place of great historical and cultural importance for Bevagna, reflecting the profound Franciscan devotion of the local community.",
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/San_Francesco.jpg"
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.607944194452331, 42.93274776821662],
    //   }, 
    //   properties: {
    //     address_it: "Piazza Filippo Silvestri",
    //     address_en: "Piazza Filippo Silvestri",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "La piazza Filippo Silvestri di Bevagna è una suggestiva piazza nel cuore del centro storico della cittadina umbra. Circondata da antichi edifici in stile medievale e rinascimentale, la piazza è dominata dalla maestosa facciata della Chiesa di San Michele Arcangelo. Al centro della piazza si trova una fontana in stile gotico, decorata con sculture e rilievi che rappresentano scene della vita quotidiana e dei miracoli di San Michele. Intorno alla fontana si trovano panchine in pietra dove è piacevole fermarsi a prendere un po' di fresco e osservare la vita che scorre tranquilla tra le viuzze antiche. Durante l'estate la piazza ospita eventi culturali, concerti e manifestazioni che attirano turisti da ogni parte.",
    //     description_en: "Piazza Filippo Silvestri in Bevagna is an evocative square in the heart of the historic center of the Umbrian town. Surrounded by ancient buildings in medieval and Renaissance styles, the square is dominated by the majestic facade of the Church of San Michele Arcangelo. At the center of the square is a Gothic-style fountain, decorated with sculptures and reliefs depicting scenes of daily life and the miracles of San Michele. Around the fountain are stone benches where it is pleasant to sit, cool off, and watch the tranquil life unfold among the ancient alleys. During the summer, the square hosts cultural events, concerts, and festivities that attract tourists from all over.",
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/Piazza.jpg"
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.608272765020507, 42.93271831137097],
    //   }, 
    //   properties: {
    //     address_it: "Teatro Francesco Torti",
    //     address_en: "Francesco Torti Theater",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "Il Teatro Francesco Torti di Bevagna è un gioiello architettonico situato nel cuore del centro storico della città. Costruito nel XVIII secolo, il teatro conserva intatta la sua struttura originale, con un elegante proscenio adornato da decorazioni in stile neoclassico e una ricca decorazione interna. La sala, che può ospitare fino a 150 persone, è ideale per spettacoli teatrali, concerti e eventi culturali di vario genere.\n\n Ogni anno, il Teatro Torti ospita una variegata programmazione artistica, che spazia dalla prosa al balletto, dalla musica classica al teatro contemporaneo, offrendo al pubblico esperienze culturali di alta qualità e coinvolgenti.",
    //     description_en: "The Francesco Torti Theater in Bevagna is an architectural gem located in the heart of the city's historic center. Built in the 18th century, the theater retains its original structure, with an elegant proscenium adorned with neoclassical decorations and rich interior decor. The hall, which can accommodate up to 150 people, is ideal for theatrical performances, concerts, and various cultural events.\n\n Every year, the Torti Theater hosts a diverse artistic program, ranging from drama to ballet, from classical music to contemporary theater, offering the audience high-quality and engaging cultural experiences.",
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/Teatro_Torti.jpg"
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.609305845474651, 42.93377505471904],
    //   }, 
    //   properties: {
    //     address_it: "Auditorium Santa Maria Laurentia",
    //     address_en: "Auditorium Santa Maria Laurentia",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "La parrocchia fu fondata da un gruppo di 34 famiglie rifugiatesi a Bevagna in seguito alla distruzione, ordinata dal pontefice, dei castelli di Antignano, fedele a Federico II di Svevia.\n\n La chiesa, oggi sconsacrata e usata come Auditorium, conserva un bel portale con un rilievo che raffigura la Madonna che allatta il Bambino.",
    //     description_en: "The parish was founded by a group of 34 families who took refuge in Bevagna following the destruction, ordered by the Pope, of the castles of Antignano, which were loyal to Frederick II of Swabia.\n\n The church, now deconsecrated and used as an auditorium, retains a beautiful portal with a relief depicting the Madonna nursing the Child.",
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/Auditorium.jpg",
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.608973164004386, 42.93164149051439],
    //   }, 
    //   properties: {
    //     address_it: "Accolta (Lavatoio Pubblico)",
    //     address_en: "The Accolta",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "L'accolta di Bevagna è un antico lavatoio pubblico situato nel centro storico della città. Risalente al XV secolo, quest'edificio è un esempio notevole di architettura medievale e rappresenta un importante punto di incontro per la comunità locale.L'accolta è caratterizzata da una struttura a pianta rettangolare con un portico a colonne che siaffaccia su un grande bacino d'acqua. Questo lavatoio veniva utilizzato dalle donne del paese per lavare i panni e raccogliere acqua pulita per le attività domestiche.\n\n Oggi, l'accolta di Bevagna è diventata un luogo di interesse storico e culturale, visitato da turisti e curiosi che desiderano immergersi nell'atmosfera autentica di questo antico lavatoio. Inoltre, durante il periodo estivo, l'accolta di Bevagna ospita eventi culturali e ricreativi, tra cui concerti, mostre d'arte e spettacoli teatrali, che contribuiscono a valorizzare e promuovere il patrimonio storico e artistico della città.",
    //     description_en: `The 'accolta' of Bevagna is an ancient public washhouse located in the historic center of the city. Dating back to the 15th century, this building is a remarkable example of medieval architecture and represents an important gathering place for the local community. The washhouse features a rectangular structure with a columned portico overlooking a large water basin. This washhouse was used by the women of the town to wash clothes and collect clean water for domestic activities.\n\n Today, the 'accolta' of Bevagna has become a site of historical and cultural interest, visited by tourists and curious onlookers who wish to immerse themselves in the authentic atmosphere of this ancient washhouse. Moreover, during the summer, the "accolta" hosts cultural and recreational events, including concerts, art exhibitions, and theatrical performances, contributing to the enhancement and promotion of the city's historical and artistic heritage.`,
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/Lavatoio.jpg"
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.609549274700179, 42.9349358441573],
    //   }, 
    //   properties: {
    //     address_it: "Edificio delle Terme",
    //     address_en: "Bath building",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "Del complesso termale rimane il frigidarium, formato da nicchie decorate a mosaico a tessere bianche e nere. I recenti restauri hanno messo in evidenza tracce del calidarium. Il bel mosaico, del II sec. d. C., di pregevole e raffinata fattura, si ispira al mondo marino.",
    //     description_en: "The frigidarium remains of the thermal complex, formed by mosaic-decorated niches with black and white tesserae. Recent restorations have revealed traces of the calidarium. The beautiful mosaic, from the 2nd century A.C., of exquisite and refined workmanship, is inspired by the marine world.",
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/Teatro_Romano_Terme.jpg"
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.60969600097808, 42.93468947276769],
    //   }, 
    //   properties: {
    //     address_it: "Tempio",
    //     address_en: "Temple",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "Risalente all'epoca repubblicana (II sec. a.C.), conserva l'alto podio originariamente rivestito, le pareti complete della cella in blocchetti con ricorsi in mattoni, con semicolonne e lesene rivestite in stucco, simulando una struttura interamente circondata da colonne marmoree. Il tempio si è preservato grazie alla sua trasformazione, in epoca Medioevale, nella ex chiesa della Madonna della Neve.\n\n Oggi è parte della Residenza d’Epoca, Orto degli Angeli.",
    //     description_en: "Dating back to the Republican era (2nd century BC), it preserves the high podium originally covered, the complete walls of the cella in small blocks with brick courses, with semi-columns and pilasters covered in stucco, simulating a structure entirely surrounded by marble columns. The temple has been preserved thanks to its transformation, in the Medieval period, into the former church of Madonna della Neve.\n\n Today it is part of the Historical Residence, Orto degli Angeli.",
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/Tempio.jpg"
    //   },
    // },
    // {
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     coordinates: [12.606272352000518, 42.93095178075009],
    //   }, 
    //   properties: {
    //     address_it: "Chiesa di Sant'Agostino",
    //     address_en: "Church of Sant'Agostino",
    //     city: "Bevagna",
    //     country: "Italy",
    //     postalCode: "06031",
    //     description_it: "Fu fondata nel 1316, insieme all'originario convento degli agostiniani, nei pressi dell'antica chiesa di San Pietro.Nella tribuna e lungo le pareti si trovano frammenti di affreschi votivi del XIV secolo su più strati. Un recente restauro, realizzato grazie a Don Aldo Giovannelli, ha portato alla luce una serie di absidiole, decorate nel corso del XVI secolo, destinate agli altari e raffiguranti soggetti dedicati alla Vergine.",
    //     description_en: "It was founded in 1316, together with the original Augustinian convent, near the ancient church of San Pietro. In the apse and along the walls, there are fragments of votive frescoes from the 14th century on multiple layers. A recent restoration, carried out thanks to Don Aldo Giovannelli, has brought to light a series of small apses, decorated in the 16th century, intended for altars and depicting subjects dedicated to the Virgin.",
    //     markerType: "tourism",
    //     img: "./assets/img/card_background/SantAgostino.jpg"
    //   },
    // },
    // END POINT OF INTEREST
    
    // TOILET
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.608545097301263, 42.93266494869125],
      }, 
      properties: {
        address_it: "Bagni pubblici",
        address_en: "Public toilet",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "",
        description_en: "",
        markerType: "toilet",
      },
    },
    // END TOILET

    // WATER POINT
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.608108088084045, 42.932672363152506],
      }, 
      properties: {
        address_it: "Fontana con Acqua Potabile",
        address_en: "Drinking Water Fountain",
        city: "Bevagna",
        country: "Italy",
        postalCode: "06031",
        description_it: "",
        description_en: "",
        markerType: "water",
      },
    },
    // END WATER POINT
  ],
};

/**
 * Assign a unique id to each store. You'll use this `id`
 * later to associate each point on the map with a listing
 * in the sidebar.
 */
stores.features.forEach(function (store, i) {
  store.properties.id = i;
});

// GPS
var geolocateControl = new mapboxgl.GeolocateControl({
  positionOptions: {
      enableHighAccuracy: true
  },
  trackUserLocation: true,
  showUserLocation: true
});

map.addControl(geolocateControl);

// Save geolocation status in localStorage
function saveGeolocationStatus(isEnabled) {
  localStorage.setItem('geolocationEnabled', isEnabled);
}

// Retrieve geolocation status from localStorage
function getGeolocationStatus() {
  return localStorage.getItem('geolocationEnabled') === 'true';
}

// Usage example when activating geolocation
if (getGeolocationStatus()) {
  // Code to activate geolocation
  activateGeolocation();
}

// Update geolocation status whenever it's toggled
function activateGeolocation() {
  saveGeolocationStatus(true);
  // Code to activate geolocation
}

function deactivateGeolocation() {
  saveGeolocationStatus(false);
  // Code to deactivate geolocation
}

/**
 * Wait until the map loads to make changes to the map.
*/
map.on("load", function (e) {
  /**
   * This is where your '.addLayer()' used to be, instead
   * add only the source without styling a layer
   */
  map.addSource("places", {
    type: "geojson",
    data: stores,
  });

  /**
   * Add all the things to the page:
   * - The location listings on the side of the page
   * - The markers onto the map
   * 
   */
  buildLocationList(stores);
  addMarkers();
});

/**
 * Add a marker to the map for every store listing.
 **/
function addMarkers() {
  /* For each feature in the GeoJSON object above: */
  stores.features.forEach(function (marker) {
    /* Create a div element for the marker. */
    var el = document.createElement("div");
    /* Assign a unique `id` to the marker. */
    el.id = "marker-" + marker.properties.id;
    /* Assign the `marker` class to each marker for styling. */
    // el.className = "marker";

    // to have different marker styles for each service
    if (marker.properties.markerType) {
      el.className = "marker-" + marker.properties.markerType;
    } else {
      el.className = "marker-default"; // Fallback class
    }
    /**
     * Create a marker using the div element
     * defined above and add it to the map.
     **/
    new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);

    /**
     * Listen to the element and when it is clicked, do three things:
     * 1. Fly to the point
     * 2. Close all other popups and display popup for clicked store
     * 3. Highlight listing in sidebar (and remove highlight for all other listings)
     **/
    el.addEventListener("click", function (e) {
      /* Fly to the point */
      flyToStore(marker);
      /* Close all other popups and display popup for clicked store */
      makeHighlight(marker);
      showInfoCard(marker.properties.address_it, marker.properties.address_en, marker.properties.description_it, marker.properties.description_en, marker.properties.img, marker.properties.markerType, marker.properties.site);
      /* Highlight listing in sidebar */
      e.stopPropagation();
      
    });
  });
}

// This function is to translate the listings

function updateAddresses(data) {
  var listings = document.getElementById("listings").children;
  Array.from(listings).forEach(function (listing, i) {
      var prop = data.features[i].properties;
      var link = listing.querySelector("a.title");
      if (language == "it") {
          link.innerHTML = prop.address_it;
      } else {
          link.innerHTML = prop.address_en;
      }
  });
}


let currentFilter = 'all';
/**
 * Add a listing for each store to the sidebar.
**/
function buildLocationList(data) {
  if (!data || !data.features || !Array.isArray(data.features)) {
    console.error('Invalid data format for buildLocationList');
    return;
  }
  const listingsContainer = document.getElementById('listings');
  listingsContainer.innerHTML = '';
  data.features.forEach(function (store, i) {
    /**
     * Create a shortcut for `store.properties`,
     * which will be used several times below.
    **/
    var prop = store.properties;
   /* Add a new listing section to the sidebar. */
    var listings = document.getElementById("listings");
    var listing = listings.appendChild(document.createElement("div"));
    /* Assign a unique `id` to the listing. */
    listing.id = "listing-" + prop.id;

    /* Assign the `item` class to each listing for styling. */
    if (prop.markerType) {
      listing.className = "item item-" + prop.markerType;
    } else {
      listing.className = "item item-default"; // Fallback class
    }
    

    /* Add the link to the individual listing created above. */
    var link = listing.appendChild(document.createElement("a"));
    
    link.href = "#";
    link.className = "title";
    link.id = "link-" + prop.id;
  
    if (language == "it") {
      link.innerHTML = prop.address_it;
    } else {
      link.innerHTML = prop.address_en;
    }
        
    /**
     * Listen to the element and when it is clicked, do four things:
     * 1. Update the `currentFeature` to the store associated with the clicked link
     * 2. Fly to the point
     * 3. Close all other popups and display popup for clicked store
     * 4. Highlight listing in sidebar (and remove highlight for all other listings)
     **/
    link.addEventListener("click", function (e) {
      for (var i = 0; i < data.features.length; i++) {
        if (this.id === "link-" + data.features[i].properties.id) {
          var clickedListing = data.features[i];
          flyToStore(clickedListing);
          makeHighlight(clickedListing);
        }
      }
      var activeItem = document.getElementsByClassName("active");
      if (activeItem[0]) {
        activeItem[0].classList.remove("active");
      }
      this.parentNode.classList.add("active");
    });
  });
}

document.getElementById('filter-dropdown').addEventListener('change', handleFilterChange);
document.getElementById('marker-dropdown').addEventListener('change', handleFilterChange);

function handleFilterChange(event) {
    const selectedType = event.target.value;
    currentFilter = selectedType;
    document.getElementById('filter-dropdown').value = selectedType;
    document.getElementById('marker-dropdown').value = selectedType;
    applyFilters(selectedType);
    return (selectedType);
}

/**
 * Use Mapbox GL JS's `flyTo` to move the camera smoothly
 * a given center point.
 **/
function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 20,
  });
  sidebar.setAttribute("hidden", "hidden");
}

function makeHighlight(currentFeature) {
  var marker = document.getElementById(
    "marker-" + currentFeature.properties.id
  );
}

//FILTERS

function applyFilters(selectedType) {
    
  const filteredListings = stores.features.filter(store => 
      (selectedType === 'all' || store.properties.markerType === selectedType)
  );
  
  updateListings(filteredListings);
  updateMarkers(filteredListings);

}


function updateListings(filteredListings) {
  // var listings = document.getElementById("listings");
  // listings.innerHTML = '';
  buildLocationList({ type: 'FeatureCollection', features: filteredListings });
}

function updateMarkers(filteredListings) {
  stores.features.forEach(feature => {
      const markerElement = document.getElementById(`marker-${feature.properties.id}`);
      
      if (filteredListings.includes(feature)) {
        if (markerElement) {
              markerElement.style.display = 'inline';
          }
      } else {
          if (markerElement) {;
              markerElement.style.display = 'none';
          }
      }
      document.getElementById('marker-dropdown').style.display = 'none';
  });
}

function showFilter() {
  document.getElementById('marker-dropdown').style.display = 'inline';
}

// TRANSLATION FUNCTION
const translations = {
  it: {
      filterOptions: [
          "Tutte le categorie",
          "Portali Gaite", 
          "Mestieri medievali",  
          "Gaita San Giovanni", 
          "Gaita San Giorgio", 
          "Gaita San Pietro", 
          "Gaita Santa Maria", 
          "Le Porte",
          "Punti d'interesse",
          "Parcheggi", 
          "Bagni Pubblici", 
          "Fontana di Acqua Potabile"
      ]
  },
  en: {
      filterOptions: [
          "All Categories", 
          "Gaite Portal", 
          "Medieval Crafts",
          "Gaita San Giovanni", 
          "Gaita San Giorgio", 
          "Gaita San Pietro", 
          "Gaita Santa Maria", 
          "The Doors", 
          "Points of Interest",
          "Parking lots", 
          "Public Toilet", 
          "Drinking Water Fountain"
      ]
  }
};
function translate(language) {
  
  document.getElementById('all').innerHTML = translations[language].filterOptions[0];
  document.getElementById('portals').innerHTML = translations[language].filterOptions[1];
  document.getElementById('sanGiovanni').innerHTML = translations[language].filterOptions[3];
  document.getElementById('sanGiorgio').innerHTML = translations[language].filterOptions[4];
  document.getElementById('sanPietro').innerHTML = translations[language].filterOptions[5];
  document.getElementById('santaMaria').innerHTML = translations[language].filterOptions[6];
  document.getElementById('entrance').innerHTML = translations[language].filterOptions[7];
  // document.getElementById('tourism').innerHTML = translations[language].filterOptions[8];
  document.getElementById('parking').innerHTML = translations[language].filterOptions[9];
  document.getElementById('toilet').innerHTML = translations[language].filterOptions[10];
  document.getElementById('water').innerHTML = translations[language].filterOptions[11];

  
  document.getElementById('marker-all').innerHTML = translations[language].filterOptions[0];
  document.getElementById('marker-portals').innerHTML = translations[language].filterOptions[1];
  document.getElementById('marker-sanGiovanni').innerHTML = translations[language].filterOptions[3];
  document.getElementById('marker-sanGiorgio').innerHTML = translations[language].filterOptions[4];
  document.getElementById('marker-sanPietro').innerHTML = translations[language].filterOptions[5];
  document.getElementById('marker-entrance').innerHTML = translations[language].filterOptions[7];
  // document.getElementById('marker-tourism').innerHTML = translations[language].filterOptions[8];
  document.getElementById('marker-parking').innerHTML = translations[language].filterOptions[9];
  document.getElementById('marker-santaMaria').innerHTML = translations[language].filterOptions[6];
  document.getElementById('marker-toilet').innerHTML = translations[language].filterOptions[10];
  document.getElementById('marker-water').innerHTML = translations[language].filterOptions[11];
  
  // Reload listings in the correct language
  language = language;
  applyFilters(currentFilter);
}

function english() {
  language = 'en';
  translate('en');
  document.getElementById('privacy-policy-it').style.display = 'none';
  document.getElementById('privacy-policy-en').style.display = 'block';
  document.getElementById('credits-it').style.display = 'none';
  document.getElementById('credits-en').style.display = 'block';
}

function italian() {
  language = 'it';
  translate('it');
  document.getElementById('privacy-policy-en').style.display = 'none';
  document.getElementById('privacy-policy-it').style.display = 'block';
  document.getElementById('credits-en').style.display = 'none';
  document.getElementById('credits-it').style.display = 'block';
}

// Automatically set the language based on the browser language setting
if (navigator.language === "it" || navigator.language == "it-IT" || navigator.language == "it-CH") {
  language = "it";
  translate('it');
  document.getElementById('privacy-policy-en').style.display = 'none';
  document.getElementById('privacy-policy-it').style.display = 'block';
  document.getElementById('credits-en').style.display = 'none';
  document.getElementById('credits-it').style.display = 'block';
} else {
  language = "en";
  translate('en');
  document.getElementById('privacy-policy-it').style.display = 'none';
  document.getElementById('privacy-policy-en').style.display = 'block';
  document.getElementById('credits-it').style.display = 'none';
  document.getElementById('credits-en').style.display = 'block';
};
