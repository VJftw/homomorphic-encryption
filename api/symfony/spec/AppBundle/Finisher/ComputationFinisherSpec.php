<?php

namespace spec\AppBundle\Finisher;

use AppBundle\Entity\Computation;
use Hashids\HashGenerator;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

/**
 * Class ComputationFinisherSpec
 * @package spec\AppBundle\Finisher
 */
class ComputationFinisherSpec extends ObjectBehavior
{

    function let(
        HashGenerator $hashGenerator
    ) {
        $this->beConstructedWith($hashGenerator);
    }

    function it_is_initializable()
    {
        $this->shouldHaveType('AppBundle\Finisher\ComputationFinisher');
    }

    function it_should_generate_a_hash_id_for_the_computation(
        HashGenerator $hashGenerator,
        Computation $computation,
        \DateTime $dateTime
    ) {
        $computation->getTimestamp()
            ->shouldBeCalled()
            ->willReturn($dateTime)
        ;
        $dateTime->getTimestamp()
            ->shouldBeCalled()
            ->willReturn("TIMESTAMP")
        ;

        $hashGenerator->encode("TIMESTAMP")
            ->shouldBeCalled()
            ->willReturn("abcdef")
        ;

        $computation->setHashId("abcdef")
            ->shouldBeCalled()
            ->willReturn($computation)
        ;

        $computation->setAuthToken(Argument::any())
            ->shouldBeCalled()
            ->willReturn($computation)
        ;

        $this->finishComputation($computation)
            ->shouldReturn($computation)
        ;
    }
}
