import TeamCard from '@/components/ui/TeamCard';

const teamMembers = [
  {
    name: 'Sd. Tasneem Banu',
    role: 'ML Engineer',
    description: 'Specializes in deep learning architectures and time-series forecasting. Led the development of the LSTM prediction model.',
    imageUrl: 'data:image/jpeg;base64,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',
    socials: {
      email: 'banu.chen@agricastnet.ai',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    name: 'B. Sailaja',
    role: 'Frontend Developer',
    description: 'Expert in React and modern UI/UX design. Created the responsive dashboard and data visualization components.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxd7mXv4yeRjdbMiUlidbfZEHNrclPVYaixA&s',
    socials: {
      email: 'sailaja.b@agricastnet.ai',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    name: 'Sk. Nazeera',
    role: 'Backend Developer',
    description: 'Full-stack developer with expertise in Flask and API design. Implemented the prediction pipeline and data processing.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYcfxK_o3XqO0IBBZz1YpndMoSS_WbvbEC0g&s',
    socials: {
      email: 'nazeera.s@agricastnet.ai',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
];

const projectGuide = {
  name: 'M. Sathyam Reddy',
  role: 'Project Guide & Advisor',
  description: 'Professor of Agricultural Technology with 15+ years of research in precision agriculture and IoT systems. Supervised the research methodology.',
  imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGHbr6YqIJUH6ULoecsXhS7z_DCCl50mWccA&s',
  isGuide: true,
  socials: {
    email: 'sathyam.reddy@university.edu',
    linkedin: 'https://linkedin.com',
  },
};

const Team = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-width px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Meet Our <span className="gradient-text">Team</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The brilliant minds behind AgriCastNet, combining expertise in machine learning, 
            software development, and agricultural science.
          </p>
        </div>

        {/* Project Guide */}
        <div className="max-w-md mx-auto mb-12">
          <TeamCard {...projectGuide} />
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamCard key={member.name} {...member} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="glass-card inline-block p-8 max-w-2xl">
            <h2 className="font-display font-semibold text-xl mb-4">
              About Our Project
            </h2>
            <p className="text-muted-foreground mb-4">
              AgriCastNet is a capstone project developed as part of our Computer Science program. 
              The project aims to demonstrate the practical application of deep learning in agriculture, 
              specifically for microclimate prediction in smart greenhouses.
            </p>
            <p className="text-muted-foreground">
              Special thanks to our institution and all the researchers whose work in 
              agricultural IoT and time-series forecasting made this project possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
