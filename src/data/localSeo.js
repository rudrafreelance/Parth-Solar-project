export const SITE_NAME = 'Ideal Energy'
export const SITE_URL_FALLBACK = 'https://idealenergy.in'
export const CITY = 'Ahmedabad'
export const REGION = 'Gujarat'

export const DEFAULT_TITLE = 'Solar Panel Installation in Ahmedabad | Ideal Energy'
export const DEFAULT_DESCRIPTION =
  'Ideal Energy installs rooftop solar in Ahmedabad and Gujarat for homes, shops, and factories. Free site survey, clear pricing, and PM Surya Ghar subsidy help.'

export const homeFaqs = [
  {
    question: 'How much does rooftop solar cost in Ahmedabad?',
    answer:
      'The price depends on your monthly bill, roof size, and whether you add a battery. After a free site survey in Ahmedabad, Ideal Energy sends a clear system size, expected savings, and payback — before you commit.',
  },
  {
    question: 'Can I get the PM Surya Ghar subsidy in Gujarat?',
    answer:
      'Eligible homes in Gujarat can apply under PM Surya Ghar. Ideal Energy checks your eligibility, prepares the document checklist, and helps with the DISCOM and net-metering process alongside the installation.',
  },
  {
    question: 'Which areas do you install solar in?',
    answer:
      'We install across Ahmedabad and nearby Gujarat, including Gandhinagar, Sanand, Naroda, Nikol, Bopal, Gota, and surrounding towns. Share your location on WhatsApp and we will confirm a survey slot.',
  },
  {
    question: 'How long does a home solar installation take?',
    answer:
      'Most Ahmedabad home systems are installed in one to three days once approvals are in place. Net metering and subsidy paperwork run in parallel, and your project contact keeps you updated.',
  },
  {
    question: 'Will solar work during a power cut?',
    answer:
      'A grid-tied system pauses during an outage for safety. Add battery storage if you want backup for lights, fans, and other essential loads when the grid is down.',
  },
  {
    question: 'Do you maintain solar systems you did not install?',
    answer:
      'Yes. Ideal Energy cleans, tests, and repairs residential and commercial systems across Ahmedabad, including plants installed by another company.',
  },
]

const serviceSeoById = {
  residential: {
    title: 'Residential Solar Installation in Ahmedabad | Ideal Energy',
    description:
      'Rooftop solar for Ahmedabad homes and villas. Ideal Energy sizes the system to your bill, handles net metering, and helps with the Gujarat subsidy.',
    heading: 'Residential solar installation in Ahmedabad',
    localCopy:
      'Homeowners in Ahmedabad use rooftop solar to cut Torrent Power and UGVCL bills. We design the layout for your roof, explain the PM Surya Ghar subsidy, and install with a crew based in Gujarat.',
  },
  commercial: {
    title: 'Commercial Solar Panels in Ahmedabad | Ideal Energy',
    description:
      'Commercial rooftop solar for offices, shops, schools, and warehouses in Ahmedabad. Lower daytime electricity cost with a surveyed, documented install.',
    heading: 'Commercial solar panels in Ahmedabad',
    localCopy:
      'Shops, offices, schools, and warehouses in Ahmedabad can offset daytime load with a commercial rooftop plant. We match the system to your sanctioned load and coordinate the DISCOM connection.',
  },
  industrial: {
    title: 'Industrial Solar Plant in Gujarat | Ideal Energy',
    description:
      'Industrial solar for factories and campuses in Gujarat. Ideal Energy engineers high-output plants with phased installation and grid synchronization.',
    heading: 'Industrial solar plants in Gujarat',
    localCopy:
      'Factories around Ahmedabad, Sanand, and the Gujarat industrial belt use solar to control demand charges. We plan HT/LT integration, structure, and a phased install that fits production schedules.',
  },
  'water-heater': {
    title: 'Solar Water Heater in Ahmedabad | Ideal Energy',
    description:
      'Solar water heaters for Ahmedabad homes, hotels, and hostels. Lower hot-water cost with insulated storage and a one to two day installation.',
    heading: 'Solar water heaters in Ahmedabad',
    localCopy:
      'A solar water heater suits Ahmedabad homes, hotels, and hostels that use hot water every day. We size the tank to your usage and install it in one to two days.',
  },
  'solar-pump': {
    title: 'Solar Water Pump in Gujarat | Ideal Energy',
    description:
      'Solar pumps for farms and estates in Gujarat. Ideal Energy sizes the pump to your water depth and daily irrigation need, with no diesel dependency.',
    heading: 'Solar water pumps for Gujarat farms',
    localCopy:
      'Farmers across Gujarat use solar pumps to irrigate without diesel. We match pump and array size to bore depth, flow, and the hours you actually run water.',
  },
  battery: {
    title: 'Solar Battery Storage in Ahmedabad | Ideal Energy',
    description:
      'Solar batteries for Ahmedabad homes and clinics. Store daytime solar for evenings and power cuts, on a new system or one you already have.',
    heading: 'Solar battery storage in Ahmedabad',
    localCopy:
      'Ahmedabad power cuts and evening use are the usual reasons to add a battery. We check your inverter and critical loads before recommending a storage size that can grow later.',
  },
  maintenance: {
    title: 'Solar Panel Cleaning & Maintenance in Ahmedabad | Ideal Energy',
    description:
      'Solar panel cleaning, inspection, and repair in Ahmedabad. Ideal Energy services existing systems so output stays high through dust season.',
    heading: 'Solar panel maintenance in Ahmedabad',
    localCopy:
      'Dust in Ahmedabad cuts panel output if modules are not cleaned. We inspect wiring, test production, and service residential and commercial plants — including systems we did not originally install.',
  },
  amc: {
    title: 'Solar AMC in Ahmedabad | Ideal Energy',
    description:
      'Annual maintenance contracts for solar plants in Ahmedabad. Scheduled visits, priority support, and a yearly health report from Ideal Energy.',
    heading: 'Solar AMC in Ahmedabad',
    localCopy:
      'An AMC keeps a commercial or industrial plant in Ahmedabad on a fixed service calendar: cleaning, electrical checks, monitoring, and a written health report each year.',
  },
  'government-subsidy': {
    title: 'PM Surya Ghar Subsidy Help in Gujarat | Ideal Energy',
    description:
      'PM Surya Ghar and Gujarat solar subsidy guidance. Ideal Energy checks eligibility, prepares documents, and coordinates the Ahmedabad DISCOM application.',
    heading: 'PM Surya Ghar subsidy help in Gujarat',
    localCopy:
      'If your home in Gujarat qualifies, the PM Surya Ghar subsidy reduces the cost of rooftop solar. We explain what you are eligible for, prepare the paperwork, and follow the application until sanction.',
  },
}

export function getServiceSeo(id) {
  return serviceSeoById[id] || null
}
