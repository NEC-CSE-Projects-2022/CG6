import TeamCard from '@/components/ui/TeamCard';

const teamMembers = [
  {
    name: 'Alex Chen',
    role: 'ML Engineer',
    description: 'Specializes in deep learning architectures and time-series forecasting. Led the development of the LSTM prediction model.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    socials: {
      email: 'alex.chen@agricastnet.ai',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    name: 'Sarah Williams',
    role: 'Frontend Developer',
    description: 'Expert in React and modern UI/UX design. Created the responsive dashboard and data visualization components.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    socials: {
      email: 'sarah.williams@agricastnet.ai',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    name: 'Michael Torres',
    role: 'Backend Developer',
    description: 'Full-stack developer with expertise in Flask and API design. Implemented the prediction pipeline and data processing.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    socials: {
      email: 'michael.torres@agricastnet.ai',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
];

const projectGuide = {
  name: 'Dr. Emily Roberts',
  role: 'Project Guide & Advisor',
  description: 'Professor of Agricultural Technology with 15+ years of research in precision agriculture and IoT systems. Supervised the research methodology.',
  imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
  isGuide: true,
  socials: {
    email: 'emily.roberts@university.edu',
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
